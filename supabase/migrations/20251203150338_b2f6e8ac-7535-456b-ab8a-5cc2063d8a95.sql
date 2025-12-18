-- Create inventory items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 50,
  reorder_quantity INTEGER NOT NULL DEFAULT 100,
  unit_price DECIMAL(10, 2),
  supplier TEXT,
  expiry_date DATE,
  last_restocked TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock movements table for tracking
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'expired')),
  quantity INTEGER NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reorder alerts table
CREATE TABLE public.reorder_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'critical', 'out_of_stock', 'expiring')),
  current_stock INTEGER NOT NULL,
  reorder_level INTEGER NOT NULL,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reorder_alerts ENABLE ROW LEVEL SECURITY;

-- Inventory items policies
CREATE POLICY "Pharmacies can manage their inventory" ON public.inventory_items
  FOR ALL USING (EXISTS (SELECT 1 FROM pharmacies WHERE pharmacies.id = inventory_items.pharmacy_id AND pharmacies.user_id = auth.uid()));

CREATE POLICY "Authenticated users can view inventory" ON public.inventory_items
  FOR SELECT USING (true);

-- Stock movements policies
CREATE POLICY "Pharmacies can manage stock movements" ON public.stock_movements
  FOR ALL USING (EXISTS (SELECT 1 FROM pharmacies WHERE pharmacies.id = stock_movements.pharmacy_id AND pharmacies.user_id = auth.uid()));

-- Reorder alerts policies
CREATE POLICY "Pharmacies can manage their alerts" ON public.reorder_alerts
  FOR ALL USING (EXISTS (SELECT 1 FROM pharmacies WHERE pharmacies.id = reorder_alerts.pharmacy_id AND pharmacies.user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check and create reorder alerts
CREATE OR REPLACE FUNCTION public.check_inventory_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete existing unacknowledged alerts for this item
  DELETE FROM reorder_alerts 
  WHERE inventory_item_id = NEW.id AND is_acknowledged = false;
  
  -- Create alert based on stock level
  IF NEW.current_stock <= 0 THEN
    INSERT INTO reorder_alerts (pharmacy_id, inventory_item_id, alert_type, current_stock, reorder_level)
    VALUES (NEW.pharmacy_id, NEW.id, 'out_of_stock', NEW.current_stock, NEW.reorder_level);
  ELSIF NEW.current_stock <= NEW.reorder_level * 0.25 THEN
    INSERT INTO reorder_alerts (pharmacy_id, inventory_item_id, alert_type, current_stock, reorder_level)
    VALUES (NEW.pharmacy_id, NEW.id, 'critical', NEW.current_stock, NEW.reorder_level);
  ELSIF NEW.current_stock <= NEW.reorder_level THEN
    INSERT INTO reorder_alerts (pharmacy_id, inventory_item_id, alert_type, current_stock, reorder_level)
    VALUES (NEW.pharmacy_id, NEW.id, 'low_stock', NEW.current_stock, NEW.reorder_level);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-create alerts on inventory update
CREATE TRIGGER check_inventory_alerts_trigger
  AFTER INSERT OR UPDATE OF current_stock ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.check_inventory_alerts();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reorder_alerts;