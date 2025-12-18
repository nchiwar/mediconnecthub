-- Create prescription status enum
CREATE TYPE public.prescription_status AS ENUM ('pending', 'signed', 'sent_to_pharmacy', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled');

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  pharmacy_id UUID,
  diagnosis TEXT NOT NULL,
  notes TEXT,
  digital_signature TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  blockchain_hash TEXT,
  status prescription_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescription items table
CREATE TABLE public.prescription_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pharmacies table
CREATE TABLE public.pharmacies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  delivery_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescription fulfillments table for delivery tracking
CREATE TABLE public.prescription_fulfillments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id),
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id),
  status prescription_status NOT NULL DEFAULT 'processing',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  delivery_address TEXT,
  delivery_notes TEXT,
  tracking_updates JSONB DEFAULT '[]'::jsonb,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_fulfillments ENABLE ROW LEVEL SECURITY;

-- Prescriptions policies
CREATE POLICY "Patients can view their prescriptions" ON public.prescriptions
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view prescriptions they created" ON public.prescriptions
  FOR SELECT USING (EXISTS (SELECT 1 FROM doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()));

CREATE POLICY "Doctors can create prescriptions" ON public.prescriptions
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()));

CREATE POLICY "Doctors can update their prescriptions" ON public.prescriptions
  FOR UPDATE USING (EXISTS (SELECT 1 FROM doctors WHERE doctors.id = prescriptions.doctor_id AND doctors.user_id = auth.uid()));

CREATE POLICY "Pharmacies can view assigned prescriptions" ON public.prescriptions
  FOR SELECT USING (EXISTS (SELECT 1 FROM pharmacies WHERE pharmacies.id = prescriptions.pharmacy_id AND pharmacies.user_id = auth.uid()));

CREATE POLICY "Pharmacies can update assigned prescriptions" ON public.prescriptions
  FOR UPDATE USING (EXISTS (SELECT 1 FROM pharmacies WHERE pharmacies.id = prescriptions.pharmacy_id AND pharmacies.user_id = auth.uid()));

-- Prescription items policies
CREATE POLICY "Users can view prescription items for their prescriptions" ON public.prescription_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM prescriptions p 
    WHERE p.id = prescription_items.prescription_id 
    AND (p.patient_id = auth.uid() OR EXISTS (SELECT 1 FROM doctors d WHERE d.id = p.doctor_id AND d.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM pharmacies ph WHERE ph.id = p.pharmacy_id AND ph.user_id = auth.uid()))
  ));

CREATE POLICY "Doctors can manage prescription items" ON public.prescription_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM prescriptions p 
    JOIN doctors d ON d.id = p.doctor_id 
    WHERE p.id = prescription_items.prescription_id AND d.user_id = auth.uid()
  ));

-- Pharmacies policies
CREATE POLICY "Pharmacies viewable by authenticated users" ON public.pharmacies
  FOR SELECT USING (true);

CREATE POLICY "Pharmacy owners can manage their pharmacy" ON public.pharmacies
  FOR ALL USING (auth.uid() = user_id);

-- Fulfillments policies
CREATE POLICY "Patients can view their fulfillments" ON public.prescription_fulfillments
  FOR SELECT USING (EXISTS (SELECT 1 FROM prescriptions p WHERE p.id = prescription_fulfillments.prescription_id AND p.patient_id = auth.uid()));

CREATE POLICY "Pharmacies can manage fulfillments" ON public.prescription_fulfillments
  FOR ALL USING (EXISTS (SELECT 1 FROM pharmacies ph WHERE ph.id = prescription_fulfillments.pharmacy_id AND ph.user_id = auth.uid()));

CREATE POLICY "Doctors can view fulfillments for their prescriptions" ON public.prescription_fulfillments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM prescriptions p 
    JOIN doctors d ON d.id = p.doctor_id 
    WHERE p.id = prescription_fulfillments.prescription_id AND d.user_id = auth.uid()
  ));

-- Triggers for updated_at
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pharmacies_updated_at BEFORE UPDATE ON public.pharmacies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fulfillments_updated_at BEFORE UPDATE ON public.prescription_fulfillments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for prescriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescription_fulfillments;