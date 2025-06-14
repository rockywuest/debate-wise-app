
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface ReputationTransaction {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  created_at: string;
  related_argument_id?: string;
  granted_by_user_id?: string;
}

export interface ArgumentRating {
  id: string;
  argument_id: string;
  rated_by_user_id: string;
  rating_type: 'insightful' | 'concede_point';
  created_at: string;
}

export const useReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateReputation = async (
    targetUserId: string,
    points: number,
    reason: string,
    argumentId?: string,
    grantedBy?: string
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc('update_user_reputation', {
        target_user_id: targetUserId,
        points,
        reason,
        argument_id: argumentId,
        granted_by: grantedBy
      });

      if (error) throw error;

      toast({
        title: "Reputation aktualisiert",
        description: `${points > 0 ? '+' : ''}${points} Punkte für: ${reason}`
      });
    } catch (error: any) {
      console.error('Error updating reputation:', error);
      toast({
        title: "Fehler bei Reputation-Update",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const rateArgument = async (argumentId: string, ratingType: 'insightful' | 'concede_point') => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um zu bewerten.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prüfe, ob der Benutzer bereits bewertet hat
      const { data: existingRating } = await supabase
        .from('argument_ratings')
        .select('*')
        .eq('argument_id', argumentId)
        .eq('rated_by_user_id', user.id)
        .eq('rating_type', ratingType)
        .single();

      if (existingRating) {
        toast({
          title: "Bereits bewertet",
          description: "Sie haben dieses Argument bereits so bewertet.",
          variant: "destructive"
        });
        return;
      }

      // Hole Argument-Details für Autor
      const { data: argument } = await supabase
        .from('argumente')
        .select('benutzer_id')
        .eq('id', argumentId)
        .single();

      if (!argument) throw new Error('Argument nicht gefunden');

      // Verhindere Selbstbewertung
      if (argument.benutzer_id === user.id) {
        toast({
          title: "Selbstbewertung nicht erlaubt",
          description: "Sie können Ihre eigenen Argumente nicht bewerten.",
          variant: "destructive"
        });
        return;
      }

      // Erstelle die Bewertung
      const { error: ratingError } = await supabase
        .from('argument_ratings')
        .insert({
          argument_id: argumentId,
          rated_by_user_id: user.id,
          rating_type: ratingType
        });

      if (ratingError) throw ratingError;

      // Vergebe Reputationspunkte
      const points = ratingType === 'insightful' ? 5 : 20;
      const reason = ratingType === 'insightful' ? 'Argument als einsichtig bewertet' : 'Punkt zugestanden';
      
      await updateReputation(argument.benutzer_id, points, reason, argumentId, user.id);

    } catch (error: any) {
      console.error('Error rating argument:', error);
      toast({
        title: "Fehler beim Bewerten",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getLeaderboard = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, reputation_score')
        .order('reputation_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Fehler beim Laden der Rangliste",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    updateReputation,
    rateArgument,
    getLeaderboard,
    loading
  };
};
