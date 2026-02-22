
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';

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
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return text('An unexpected error occurred.', 'Ein unerwarteter Fehler ist aufgetreten.');
  };

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
        title: text('Reputation updated', 'Reputation aktualisiert'),
        description: text(
          `${points > 0 ? '+' : ''}${points} points for: ${reason}`,
          `${points > 0 ? '+' : ''}${points} Punkte fur: ${reason}`
        )
      });
    } catch (error: unknown) {
      console.error('Error updating reputation:', error);
      toast({
        title: text('Failed to update reputation', 'Fehler bei Reputation-Update'),
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const rateArgument = async (argumentId: string, ratingType: 'insightful' | 'concede_point') => {
    if (!user) {
      toast({
        title: text('Sign-in required', 'Anmeldung erforderlich'),
        description: text('You must be signed in to rate.', 'Sie mussen angemeldet sein, um zu bewerten.'),
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Check whether the user already submitted this rating.
      const { data: existingRating } = await supabase
        .from('argument_ratings')
        .select('*')
        .eq('argument_id', argumentId)
        .eq('rated_by_user_id', user.id)
        .eq('rating_type', ratingType)
        .single();

      if (existingRating) {
        toast({
          title: text('Already rated', 'Bereits bewertet'),
          description: text('You already submitted this rating for the argument.', 'Sie haben dieses Argument bereits so bewertet.'),
          variant: "destructive"
        });
        return;
      }

      // Fetch argument details to identify the target author.
      const { data: argument } = await supabase
        .from('argumente')
        .select('benutzer_id')
        .eq('id', argumentId)
        .single();

      if (!argument) throw new Error(text('Argument not found', 'Argument nicht gefunden'));

      // Prevent self-rating.
      if (argument.benutzer_id === user.id) {
        toast({
          title: text('Self-rating not allowed', 'Selbstbewertung nicht erlaubt'),
          description: text('You cannot rate your own arguments.', 'Sie konnen Ihre eigenen Argumente nicht bewerten.'),
          variant: "destructive"
        });
        return;
      }

      // Create the rating.
      const { error: ratingError } = await supabase
        .from('argument_ratings')
        .insert({
          argument_id: argumentId,
          rated_by_user_id: user.id,
          rating_type: ratingType
        });

      if (ratingError) throw ratingError;

      // Grant reputation points.
      const points = ratingType === 'insightful' ? 5 : 20;
      const reason = ratingType === 'insightful'
        ? text('Argument rated as insightful', 'Argument als einsichtig bewertet')
        : text('Conceded a point', 'Punkt zugestanden');
      
      await updateReputation(argument.benutzer_id, points, reason, argumentId, user.id);

    } catch (error: unknown) {
      console.error('Error rating argument:', error);
      toast({
        title: text('Failed to submit rating', 'Fehler beim Bewerten'),
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, reputation_score')
        .order('reputation_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error: unknown) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: text('Failed to load leaderboard', 'Fehler beim Laden der Rangliste'),
        description: getErrorMessage(error),
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
