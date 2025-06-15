
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useEnhancedReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateQualityScore = (analysis: any): number => {
    if (!analysis) return 0;
    
    let score = 0;
    
    // Relevance (40% weight - most important)
    if (analysis.relevanz?.score) {
      score += (analysis.relevanz.score / 5) * 40;
    }
    
    // Substantiation (25% weight)
    if (analysis.substantiierung?.status === 'Vorhanden') {
      score += 25;
    }
    
    // Specificity (20% weight)
    if (analysis.spezifitaet?.status === 'Konkret') {
      score += 20;
    }
    
    // Logic (15% weight)
    if (analysis.fehlschluss?.status === 'Keiner') {
      score += 15;
    }
    
    return Math.round(score);
  };

  const awardReputation = async (
    targetUserId: string,
    actionType: 'high_quality_argument' | 'steel_manning' | 'source_provided' | 'argument_conceded' | 'fallacy_penalty',
    argumentId?: string
  ) => {
    if (!user) return;

    const reputationRules = {
      high_quality_argument: { points: 20, reason: 'Hochwertiges Argument verfasst' },
      steel_manning: { points: 30, reason: 'Fair argumentiert (Steel-Manning)' },
      source_provided: { points: 10, reason: 'Quellen bereitgestellt' },
      argument_conceded: { points: 50, reason: 'Punkt zugestanden - intellektuelle Ehrlichkeit' },
      fallacy_penalty: { points: -10, reason: 'Fehlschluss in Argument erkannt' }
    };

    const rule = reputationRules[actionType];
    if (!rule) return;

    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('update_user_reputation_secure', {
        target_user_id: targetUserId,
        points: rule.points,
        reason: rule.reason,
        argument_id: argumentId,
        granted_by: user.id
      });

      if (error) throw error;

      // Only show positive feedback to encourage good behavior
      if (rule.points > 0) {
        toast({
          title: "Reputation aktualisiert",
          description: `+${rule.points} Punkte: ${rule.reason}`,
        });
      }
    } catch (error: any) {
      console.error('Error awarding reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    awardReputation,
    calculateQualityScore,
    loading
  };
};
