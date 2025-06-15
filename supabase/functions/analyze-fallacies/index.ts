
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
    const { argumentText, debateContext } = await req.json();

    const prompt = `
Du bist ein Experte für Logik, Rhetorik und kritische Analyse. Deine Aufgabe ist es, die Qualität eines Arguments im Kontext einer übergeordneten Debatte zu bewerten. Gib deine Analyse in einem strukturierten Format aus.

**Debatten-Kontext:** "${debateContext}"

**Zu analysierendes Argument:** "${argumentText}"

**Führe die folgende Analyse in vier Schritten durch:**

1. Relevanz-Bewertung.
   - Bewerte auf einer Skala von 1-5, wie relevant das Argument für den Debatten-Kontext ist. Begründe kurz.
2. Substantiierungs-Bewertung.
   - Prüfe, ob das Argument eine reine Behauptung ist oder ob es Beweise, Daten oder konkrete Beispiele enthält. Gib an, ob eine Substantiierung vorhanden ist oder fehlt.
3. Spezifitäts-Bewertung.
   - Bewerte, ob das Argument spezifisch und konkret oder vage und allgemein formuliert ist. Begründe kurz.
4. Fehlschluss-Prüfung.
   - Prüfe, ob das Argument einen der bekannten logischen Fehlschlüsse enthält. Wenn ja, benenne ihn. Wenn nein, bestätige dies.

Gib deine Gesamtanalyse als kompaktes JSON-Objekt aus:
{
  "relevanz": { "score": [1-5], "begruendung": "..." },
  "substantiierung": { "status": "[Vorhanden|Fehlend]", "begruendung": "..." },
  "spezifitaet": { "status": "[Konkret|Vage]", "begruendung": "..." },
  "fehlschluss": { "status": "[Name des Fehlschlusses|Keiner]", "begruendung": "..." }
}
Wenn irgendein Teil der Analyse fehlt, KEINE Erklärungen, sondern trotzdem das JSON-Schema ausgeben.
`;

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
            content: "Du bist ein hochpräziser Qualitätsprüfer für Argumente. Deine Antworten sollen stets JSON im genannten Format sein."
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 350
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    // Parse the JSON from AI output; fallback to string if fails
    let analysis = null;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (err) {
      analysis = { error: "KI-Antwort konnte nicht geparst werden.", raw: data.choices[0].message.content };
    }

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
