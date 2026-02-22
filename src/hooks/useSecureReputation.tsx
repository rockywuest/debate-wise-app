
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { InputValidator } from '@/utils/inputValidation';
import { useLocalizedText } from '@/utils/i18n';

export const useSecureReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const text = useLocalizedText();

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return text('Could not process rating.', 'Die Bewertung konnte nicht verarbeitet werden.');
  };

  const rateArgumentSecurely = async (argumentId: string, ratingType: 'insightful' | 'concede_point') => {
    if (!user) {
      toast({
        title: text('Sign-in required', 'Anmeldung erforderlich'),
        description: text('You must be signed in to rate.', 'Sie mussen angemeldet sein, um zu bewerten.'),
        variant: "destructive"
      });
      return;
    }

    // Rate limiting for ratings
    if (!InputValidator.checkRateLimit(user.id, 'rate_argument', 10, 300000)) { // 10 ratings per 5 minutes
      toast({
        title: text('Too many ratings', 'Zu viele Bewertungen'),
        description: text('Please wait before submitting more ratings.', 'Bitte warten Sie, bevor Sie weitere Bewertungen abgeben.'),
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Use secure RPC function that includes additional validation
      const { data, error } = await supabase.rpc('secure_rate_argument', {
        p_argument_id: argumentId,
        p_rating_type: ratingType,
        p_user_id: user.id
      });

      if (error) throw error;

      const result = typeof data === 'object' && data !== null
        ? (data as { success?: boolean; message?: string; points_awarded?: number })
        : null;

      if (!result?.success) {
        toast({
          title: text('Rating not possible', 'Bewertung nicht moglich'),
          description: result?.message || text('The rating could not be submitted.', 'Die Bewertung konnte nicht abgegeben werden.'),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: text('Rating submitted', 'Bewertung erfolgreich'),
        description: text(
          `+${result.points_awarded || 0} reputation points awarded.`,
          `+${result.points_awarded || 0} Reputationspunkte vergeben.`
        )
      });

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

  return {
    rateArgument: rateArgumentSecurely,
    loading
  };
};
