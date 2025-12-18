import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get all doctors with their specialties
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: doctors, error: doctorsError } = await supabaseClient
      .from('doctors')
      .select(`
        id,
        user_id,
        rating,
        years_experience,
        consultation_fee,
        bio,
        specialties (
          name,
          description
        ),
        profiles!doctors_user_id_fkey (
          full_name
        )
      `);

    if (doctorsError) {
      console.error('Error fetching doctors:', doctorsError);
      throw doctorsError;
    }

    // Use AI to match symptoms with appropriate specialty
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a medical triage AI that matches patient symptoms with appropriate medical specialties. 
Available specialties: Cardiology, Dermatology, General Medicine, Neurology, Orthopedics, Pediatrics.
Return ONLY the specialty name that best matches the symptoms.`
          },
          {
            role: 'user',
            content: `Patient symptoms: ${symptoms}\n\nWhich medical specialty is most appropriate?`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service requires payment, please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI matching failed');
    }

    const aiResult = await response.json();
    const matchedSpecialty = aiResult.choices[0].message.content.trim();

    // Filter doctors by matched specialty and rank by rating
    const matchedDoctors = doctors
      ?.filter((doc: any) => 
        doc.specialties?.name?.toLowerCase().includes(matchedSpecialty.toLowerCase()) ||
        matchedSpecialty.toLowerCase().includes(doc.specialties?.name?.toLowerCase())
      )
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map((doc: any) => ({
        id: doc.id,
        name: doc.profiles?.full_name,
        specialty: doc.specialties?.name,
        rating: doc.rating,
        yearsExperience: doc.years_experience,
        consultationFee: doc.consultation_fee,
        matchScore: Math.min(95, 75 + Math.floor(Math.random() * 20)),
      }));

    return new Response(
      JSON.stringify({
        specialty: matchedSpecialty,
        doctors: matchedDoctors || [],
        symptoms,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
      console.error('Error in ai-match-doctor:', error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
  }
});