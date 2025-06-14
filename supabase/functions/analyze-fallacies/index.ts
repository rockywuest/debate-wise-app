
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { argumentText } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Du bist ein Experte für logische Argumentation. Analysiere Texte auf häufige logische Fehlschlüsse wie Ad-hominem-Angriffe, Strohmannargumente, falsche Dilemmata, Zirkelschlüsse, oder hastige Verallgemeinerungen. Antworte auf Deutsch.' 
          },
          { 
            role: 'user', 
            content: `Analysiere den folgenden Text auf häufige logische Fehlschlüsse wie Ad-hominem-Angriffe, Strohmannargumente oder falsche Dilemmata. Wenn ein wahrscheinlicher Fehlschluss erkannt wird, identifiziere ihn und gib eine kurze, neutrale Erklärung. Wenn kein Fehlschluss erkannt wird, antworte mit "Kein Fehlschluss erkannt". Text: "${argumentText}"` 
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-fallacies function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
