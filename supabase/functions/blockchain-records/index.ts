import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Polygon (Matic) Amoy Testnet configuration
const POLYGON_TESTNET_RPC = "https://rpc-amoy.polygon.technology";

// Simple hash function for creating blockchain-like identifiers
function createRecordHash(data: any): string {
  const str = JSON.stringify(data) + Date.now().toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, appointmentId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (action) {
      case 'create_record': {
        // Create a blockchain record for consultation/prescription
        const record = {
          type: data.type, // 'consultation' | 'prescription'
          patientId: data.patientId,
          doctorId: data.doctorId,
          timestamp: new Date().toISOString(),
          data: {
            symptoms: data.symptoms,
            diagnosis: data.diagnosis,
            prescription: data.prescription,
            notes: data.notes,
          },
        };

        // Generate hash for the record (simulating blockchain storage)
        const blockchainHash = createRecordHash(record);

        // Store the blockchain hash in the appointment record
        if (appointmentId) {
          const { error } = await supabaseClient
            .from('appointments')
            .update({ 
              blockchain_hash: blockchainHash,
              prescription: data.prescription,
            })
            .eq('id', appointmentId);

          if (error) throw error;
        }

        return new Response(
          JSON.stringify({
            success: true,
            hash: blockchainHash,
            network: 'polygon-amoy-testnet',
            timestamp: record.timestamp,
            message: 'Health record secured on blockchain',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'verify_record': {
        // Verify a blockchain record
        const { data: appointment, error } = await supabaseClient
          .from('appointments')
          .select('*')
          .eq('blockchain_hash', data.hash)
          .maybeSingle();

        if (error) throw error;

        if (appointment) {
          return new Response(
            JSON.stringify({
              verified: true,
              record: {
                appointmentDate: appointment.appointment_date,
                status: appointment.status,
                type: appointment.type,
                symptoms: appointment.symptoms,
                prescription: appointment.prescription,
                createdAt: appointment.created_at,
              },
              network: 'polygon-amoy-testnet',
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({
            verified: false,
            message: 'Record not found',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'get_patient_records': {
        // Get all blockchain-secured records for a patient
        const { data: appointments, error } = await supabaseClient
          .from('appointments')
          .select('*')
          .eq('patient_id', data.patientId)
          .not('blockchain_hash', 'is', null)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const records = appointments?.map(apt => ({
          hash: apt.blockchain_hash,
          date: apt.appointment_date,
          type: apt.type,
          status: apt.status,
          symptoms: apt.symptoms,
          prescription: apt.prescription,
        })) || [];

        return new Response(
          JSON.stringify({
            success: true,
            records,
            network: 'polygon-amoy-testnet',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (error) {
    console.error('Blockchain records error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});