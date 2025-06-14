
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FallacyAnalysisProps {
  argumentText: string;
}

export const FallacyAnalysis = ({ argumentText }: FallacyAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeFallacies = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('analyze-fallacies', {
          body: { argumentText }
        });

        if (error) throw error;
        setAnalysis(data.analysis);
      } catch (error) {
        console.error('Error analyzing fallacies:', error);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    if (argumentText) {
      analyzeFallacies();
    }
  }, [argumentText]);

  if (loading) {
    return (
      <Card className="mt-2 border-orange-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            <span className="text-sm text-muted-foreground">Analysiere logische Fehlschlüsse...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const hasFallacy = !analysis.toLowerCase().includes('kein fehlschluss erkannt');

  return (
    <Card className={`mt-2 ${hasFallacy ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {hasFallacy ? (
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          )}
          <div className="flex-1">
            <Badge 
              variant="outline" 
              className={`mb-2 ${hasFallacy ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'}`}
            >
              {hasFallacy ? 'Möglicher Fehlschluss erkannt' : 'Kein Fehlschluss erkannt'}
            </Badge>
            <p className="text-sm text-gray-700">{analysis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
