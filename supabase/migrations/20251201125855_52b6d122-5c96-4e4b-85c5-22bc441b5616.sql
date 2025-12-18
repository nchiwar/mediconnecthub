-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'nurse', 'pharmacy', 'hospital_admin');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create user_roles table (CRITICAL: separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create specialties table
CREATE TABLE public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
  license_number TEXT NOT NULL,
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 0.0,
  consultation_fee DECIMAL(10,2),
  bio TEXT,
  available_slots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status appointment_status DEFAULT 'pending',
  type TEXT DEFAULT 'video', -- video, in-person
  notes TEXT,
  symptoms TEXT,
  prescription TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'hospital_admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for specialties
CREATE POLICY "Specialties are viewable by everyone"
  ON public.specialties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage specialties"
  ON public.specialties FOR ALL
  USING (public.has_role(auth.uid(), 'hospital_admin'));

-- RLS Policies for doctors
CREATE POLICY "Doctors are viewable by authenticated users"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can update their own profile"
  ON public.doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own profile"
  ON public.doctors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Patients can view their own appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = appointments.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can update their appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors
      WHERE doctors.id = appointments.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default specialties
INSERT INTO public.specialties (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system specialists'),
  ('Dermatology', 'Skin, hair, and nail care specialists'),
  ('General Medicine', 'Primary care and general health'),
  ('Neurology', 'Brain and nervous system specialists'),
  ('Orthopedics', 'Bone, joint, and muscle specialists'),
  ('Pediatrics', 'Child and adolescent health specialists');

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;