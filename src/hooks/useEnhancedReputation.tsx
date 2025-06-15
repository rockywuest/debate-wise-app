
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface ReputationAction {
  type: 'argument_created' | 'argument_rated_insightful' | 'argument_rated_concede' | 'source_provided' | 'quality_feedback';
  basePoints: number;
  multiplier?: number;
  context?: string;
}

const REPUTATION_ACTIONS: Record<string, ReputationAction> = {
  'argument_created': { type: 'argument_created', basePoints: 2 },
  'argument_rated_insightful': { type: 'argument_rated_insightful', basePoints: 5 },
  'argument_rated_concede': { type: 'argument_rated_concede', basePoints: 20 },
  'source_provided': { type: 'source_provided', basePoints: 3 },
  'quality_feedback': { type: 'quality_feedback', basePoints: 1 }
};

export const useEnhancedReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateReputationPoints = (action: ReputationAction, qualityScore?: number): number => {
    let points = action.basePoints;
    
    // Apply quality multiplier for high-quality arguments
    if (qualityScore && qualityScore >= 4) {
      points *= 1.5; // 50% bonus for high-quality arguments
    }
    
    // Apply context multiplier if provided
    if (action.multiplier) {
      points *= action.multiplier;
    }
    
    return Math.round(points);
  };

  const awardReputation = async (
    targetUserId: string,
    actionType: string,
    reason: string,
    argumentId?: string,
    qualityScore?: number
  ) => {
    if (!user) return;

    const action = REPUTATION_ACTIONS[actionType];
    if (!action) {
      console.error('Unknown reputation action:', actionType);
      return;
    }

    try {
      setLoading(true);
      const points = calculateReputationPoints(action, qualityScore);
      
      const { error } = await supabase.rpc('update_user_reputation', {
        target_user_id: targetUserId,
        points,
        reason: `${reason} (${actionType})`,
        argument_id: argumentId,
        granted_by: user.id
      });

      if (error) throw error;

      toast({
        title: "Reputation aktualisiert",
        description: `+${points} Punkte für: ${reason}`
      });
    } catch (error: any) {
      console.error('Error awarding reputation:', error);
      toast({
        title: "Fehler bei Reputation-Update",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    awardReputation,
    calculateReputationPoints,
    REPUTATION_ACTIONS,
    loading
  };
};
