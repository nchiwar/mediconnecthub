import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface InventoryItem {
  id: string;
  pharmacy_id: string;
  medication_name: string;
  sku: string | null;
  category: string | null;
  current_stock: number;
  reorder_level: number;
  reorder_quantity: number;
  unit_price: number | null;
  supplier: string | null;
  expiry_date: string | null;
  last_restocked: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  inventory_item_id: string;
  pharmacy_id: string;
  movement_type: "in" | "out" | "adjustment" | "expired";
  quantity: number;
  reference_id: string | null;
  reference_type: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ReorderAlert {
  id: string;
  pharmacy_id: string;
  inventory_item_id: string;
  alert_type: "low_stock" | "critical" | "out_of_stock" | "expiring";
  current_stock: number;
  reorder_level: number;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
}

export const useInventory = (pharmacyId: string | null) => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<ReorderAlert[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pharmacyId) {
      setInventory([]);
      setAlerts([]);
      setLoading(false);
      return;
    }

    fetchInventory();
    fetchAlerts();

    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_items' }, () => fetchInventory())
      .subscribe();

    const alertsChannel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reorder_alerts' }, () => fetchAlerts())
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [pharmacyId]);

  const fetchInventory = async () => {
    if (!pharmacyId) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('pharmacy_id', pharmacyId)
        .eq('is_active', true)
        .order('medication_name');

      if (error) {
        console.error('Error fetching inventory:', error);
        return;
      }

      setInventory(data as InventoryItem[]);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    if (!pharmacyId) return;

    try {
      const { data, error } = await supabase
        .from('reorder_alerts')
        .select('*')
        .eq('pharmacy_id', pharmacyId)
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }

      setAlerts(data as ReorderAlert[]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchMovements = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('inventory_item_id', itemId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching movements:', error);
        return [];
      }

      return data as StockMovement[];
    } catch (error) {
      console.error('Error fetching movements:', error);
      return [];
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    await fetchInventory();
    return data;
  };

  const updateStock = async (
    itemId: string,
    quantity: number,
    movementType: StockMovement["movement_type"],
    notes?: string
  ) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');

    let newStock = item.current_stock;
    if (movementType === 'in') {
      newStock += quantity;
    } else if (movementType === 'out' || movementType === 'expired') {
      newStock -= quantity;
    } else {
      newStock = quantity; // adjustment sets the stock directly
    }

    // Update inventory
    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({ 
        current_stock: newStock,
        last_restocked: movementType === 'in' ? new Date().toISOString() : item.last_restocked
      })
      .eq('id', itemId);

    if (updateError) throw updateError;

    // Record movement
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        inventory_item_id: itemId,
        pharmacy_id: pharmacyId,
        movement_type: movementType,
        quantity: movementType === 'adjustment' ? newStock - item.current_stock : quantity,
        notes,
        created_by: user?.id
      });

    if (movementError) throw movementError;

    await fetchInventory();
    await fetchAlerts();
  };

  const acknowledgeAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('reorder_alerts')
      .update({
        is_acknowledged: true,
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: user?.id
      })
      .eq('id', alertId);

    if (error) throw error;
    await fetchAlerts();
  };

  const updateItem = async (itemId: string, updates: Partial<InventoryItem>) => {
    const { error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', itemId);

    if (error) throw error;
    await fetchInventory();
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase
      .from('inventory_items')
      .update({ is_active: false })
      .eq('id', itemId);

    if (error) throw error;
    await fetchInventory();
  };

  // Stats
  const lowStockItems = inventory.filter(i => i.current_stock <= i.reorder_level && i.current_stock > 0);
  const outOfStockItems = inventory.filter(i => i.current_stock <= 0);
  const criticalItems = inventory.filter(i => i.current_stock <= i.reorder_level * 0.25 && i.current_stock > 0);

  return {
    inventory,
    alerts,
    loading,
    lowStockItems,
    outOfStockItems,
    criticalItems,
    refetch: fetchInventory,
    fetchMovements,
    addInventoryItem,
    updateStock,
    updateItem,
    deleteItem,
    acknowledgeAlert,
  };
};
