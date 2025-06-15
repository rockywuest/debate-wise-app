
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type AnalysisResult = {
  relevanz?: { score: number, begruendung: string },
  substantiierung?: { status: string, begruendung: string },
  spezifitaet?: { status: string, begruendung: string },
  fehlschluss?: { status: string, begruendung: string },
  error?: string;
};

interface ArgumentQualityAnalysisProps {
  argumentText: string;
  debateTitle: string;
  debateDescription?: string;
}

export const ArgumentQualityAnalysis = ({
  argumentText,
  debateTitle,
  debateDescription
}: ArgumentQualityAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const callAnalyze = async () => {
      setLoading(true);
      setAnalysis(null);
      try {
        const debateContext = debateDescription
          ? `${debateTitle}: ${debateDescription}`
          : debateTitle;

        const { data, error } = await supabase.functions.invoke('analyze-fallacies', {
          body: {
            argumentText,
            debateContext
          }
        });

        if (error) throw error;
        setAnalysis(data.analysis);
      } catch (err) {
        setAnalysis({ error: "Analyse fehlgeschlagen." });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (argumentText && debateTitle) {
      callAnalyze();
    }
  }, [argumentText, debateTitle, debateDescription]);

  if (loading) {
    return (
      <Card className="mt-2 border-blue-200">
        <CardContent className="p-3 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-muted-foreground">Analysiere Qualität des Arguments...</span>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;
  if (analysis.error) {
    return (
      <Card className="mt-2 border-red-200 bg-red-50">
        <CardContent className="p-3 text-sm text-destructive">
          {analysis.error}
        </CardContent>
      </Card>
    );
  }

  // Icons: 🎯, 🔍, 🗣️, ✅
  const RenderEntry = (icon: React.ReactNode, name: string, value: string, badgeColor: string = "") => (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-lg">{icon}</span>
      <span className={`font-semibold ${badgeColor}`}>{name}:</span>
      <span className="">{value}</span>
    </div>
  );

  return (
    <Card className="mt-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="mb-2 font-bold text-blue-900">KI-Argument-Analyse</div>
        <div className="space-y-2">
          {analysis.relevanz && RenderEntry(
            <span aria-label="Relevanz" title="Relevanz">🎯</span>,
            `Relevanz: ${analysis.relevanz.score}/5`,
            analysis.relevanz.begruendung,
            analysis.relevanz.score >= 4 ? 'text-green-600' : analysis.relevanz.score >= 2 ? 'text-orange-600' : 'text-red-600'
          )}
          {analysis.substantiierung && RenderEntry(
            <span aria-label="Substantiierung" title="Beweislast">🔍</span>,
            `Beweislast: ${analysis.substantiierung.status}`,
            analysis.substantiierung.begruendung,
            analysis.substantiierung.status === "Vorhanden" ? "text-green-600" : "text-red-600"
          )}
          {analysis.spezifitaet && RenderEntry(
            <span aria-label="Spezifität" title="Spezifität">🗣️</span>,
            `Spezifität: ${analysis.spezifitaet.status}`,
            analysis.spezifitaet.begruendung,
            analysis.spezifitaet.status === "Konkret" ? "text-green-600" : "text-orange-600"
          )}
          {analysis.fehlschluss && RenderEntry(
            <Check className="h-4 w-4" />,
            `Logik: ${analysis.fehlschluss.status}`,
            analysis.fehlschluss.begruendung,
            analysis.fehlschluss.status !== "Keiner" ? "text-red-600" : "text-green-600"
          )}
        </div>
      </CardContent>
    </Card>
  );
};
