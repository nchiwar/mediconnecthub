import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: string;
  notes: string | null;
  symptoms: string | null;
  prescription: string | null;
  blockchain_hash: string | null;
  created_at: string;
  updated_at: string;
}

export const useAppointments = () => {
  const { user, hasRole } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    fetchAppointments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data as Appointment[]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: Appointment["status"]
  ) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);

    if (error) {
      throw error;
    }

    await fetchAppointments();
  };

  return {
    appointments,
    loading,
    refetch: fetchAppointments,
    updateStatus: updateAppointmentStatus,
  };
};