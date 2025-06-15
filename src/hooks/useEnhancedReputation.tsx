
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReputationAction {
  type: 'high_quality_argument' | 'source_provided' | 'steel_manning' | 'intellectual_honesty' | 'upvote_received' | 'fallacy_penalty';
  points: number;
  description: string;
}

const REPUTATION_ACTIONS: Record<string, ReputationAction> = {
  high_quality_argument: {
    type: 'high_quality_argument',
    points: 10,
    description: 'Argument mit hoher KI-Qualitätsbewertung eingereicht'
  },
  source_provided: {
    type: 'source_provided',
    points: 10,
    description: 'Relevante Quelle für eine Behauptung geliefert'
  },
  steel_manning: {
    type: 'steel_manning',
    points: 25,
    description: 'Faire Steel-Manning-Darstellung eines Gegenarguments'
  },
  intellectual_honesty: {
    type: 'intellectual_honesty',
    points: 50,
    description: 'Eigenes Argument zurückgezogen oder Gegenargument anerkannt'
  },
  upvote_received: {
    type: 'upvote_received',
    points: 1,
    description: 'Upvote von einem anderen Nutzer erhalten'
  },
  fallacy_penalty: {
    type: 'fallacy_penalty',
    points: -5,
    description: 'Logischer Fehlschluss in Argument erkannt'
  }
};

export const useEnhancedReputation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const awardReputation = async (userId: string, actionType: string, contextId?: string) => {
    if (!user) return;

    const action = REPUTATION_ACTIONS[actionType];
    if (!action) {
      console.error('Unknown reputation action:', actionType);
      return;
    }

    setLoading(true);
    try {
      // Check if this specific action was already awarded for this context
      if (contextId) {
        const { data: existingAward } = await supabase
          .from('reputation_transactions')
          .select('id')
          .eq('user_id', userId)
          .eq('reason', action.description)
          .eq('related_argument_id', contextId)
          .single();

        if (existingAward) {
          console.log('Reputation already awarded for this action');
          return;
        }
      }

      // Award reputation points using the existing function
      const { error: updateError } = await supabase.rpc('update_user_reputation', {
        target_user_id: userId,
        points: action.points,
        reason: action.description,
        argument_id: contextId
      });

      if (updateError) throw updateError;

      if (action.points > 0) {
        toast({
          title: "Reputation erhalten!",
          description: `+${action.points} Punkte: ${action.description}`,
        });
      }
    } catch (error) {
      console.error('Error awarding reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReputationHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('reputation_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching reputation history:', error);
      return [];
    }
  };

  const calculateQualityScore = (analysis: any) => {
    if (!analysis) return 0;
    
    let score = 0;
    
    // Relevanz (1-5) -> 0-20 Punkte
    if (analysis.relevanz?.score) {
      score += analysis.relevanz.score * 4;
    }
    
    // Substantiierung -> 0-25 Punkte
    if (analysis.substantiierung?.status === 'Vorhanden') {
      score += 25;
    }
    
    // Spezifität -> 0-25 Punkte
    if (analysis.spezifitaet?.status === 'Konkret') {
      score += 25;
    }
    
    // Logik -> 0-30 Punkte, Abzug bei Fehlschluss
    if (analysis.fehlschluss?.status === 'Keiner') {
      score += 30;
    } else {
      score -= 10; // Penalty für Fehlschluss
    }
    
    return Math.max(0, Math.min(100, score)); // Begrenzen auf 0-100
  };

  return {
    awardReputation,
    getReputationHistory,
    calculateQualityScore,
    loading,
    REPUTATION_ACTIONS
  };
};
