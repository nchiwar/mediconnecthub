import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string | null;
  created_at: string;
}

export interface Prescription {
  id: string;
  appointment_id: string | null;
  patient_id: string;
  doctor_id: string;
  pharmacy_id: string | null;
  diagnosis: string;
  notes: string | null;
  digital_signature: string | null;
  signed_at: string | null;
  blockchain_hash: string | null;
  status: "pending" | "signed" | "sent_to_pharmacy" | "processing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  items?: PrescriptionItem[];
}

export interface Pharmacy {
  id: string;
  user_id: string;
  name: string;
  license_number: string;
  address: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  delivery_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionFulfillment {
  id: string;
  prescription_id: string;
  pharmacy_id: string;
  status: Prescription["status"];
  estimated_delivery: string | null;
  actual_delivery: string | null;
  delivery_address: string | null;
  delivery_notes: string | null;
  tracking_updates: any[];
  total_price: number | null;
  created_at: string;
  updated_at: string;
}

export const usePrescriptions = () => {
  const { user, hasRole } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPrescriptions([]);
      setLoading(false);
      return;
    }

    fetchPrescriptions();
    fetchPharmacies();

    const channel = supabase
      .channel('prescriptions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prescriptions' },
        () => fetchPrescriptions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchPrescriptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prescriptions:', error);
        return;
      }

      setPrescriptions(data as Prescription[]);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching pharmacies:', error);
        return;
      }

      setPharmacies(data as Pharmacy[]);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const createPrescription = async (
    prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at' | 'items'>,
    items: Omit<PrescriptionItem, 'id' | 'prescription_id' | 'created_at'>[]
  ) => {
    const { data: prescriptionData, error: prescriptionError } = await supabase
      .from('prescriptions')
      .insert(prescription)
      .select()
      .single();

    if (prescriptionError) throw prescriptionError;

    const itemsWithPrescriptionId = items.map(item => ({
      ...item,
      prescription_id: prescriptionData.id
    }));

    const { error: itemsError } = await supabase
      .from('prescription_items')
      .insert(itemsWithPrescriptionId);

    if (itemsError) throw itemsError;

    await fetchPrescriptions();
    return prescriptionData;
  };

  const signPrescription = async (prescriptionId: string, signature: string) => {
    const { error } = await supabase
      .from('prescriptions')
      .update({
        digital_signature: signature,
        signed_at: new Date().toISOString(),
        status: 'signed'
      })
      .eq('id', prescriptionId);

    if (error) throw error;
    await fetchPrescriptions();
  };

  const sendToPharmacy = async (prescriptionId: string, pharmacyId: string) => {
    const { error } = await supabase
      .from('prescriptions')
      .update({
        pharmacy_id: pharmacyId,
        status: 'sent_to_pharmacy'
      })
      .eq('id', prescriptionId);

    if (error) throw error;
    await fetchPrescriptions();
  };

  const updatePrescriptionStatus = async (prescriptionId: string, status: Prescription["status"]) => {
    const { error } = await supabase
      .from('prescriptions')
      .update({ status })
      .eq('id', prescriptionId);

    if (error) throw error;
    await fetchPrescriptions();
  };

  return {
    prescriptions,
    pharmacies,
    loading,
    refetch: fetchPrescriptions,
    createPrescription,
    signPrescription,
    sendToPharmacy,
    updatePrescriptionStatus,
  };
};
