
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedText } from '@/utils/i18n';

// Define the expected response type from the RPC function
interface RateArgumentResponse {
  success: boolean;
  message?: string;
  points_awarded?: number;
}

// Type guard function to safely check if the response has the expected structure
const isRateArgumentResponse = (data: unknown): data is RateArgumentResponse => {
  const typedData = data as { success?: unknown };
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    typeof typedData.success === 'boolean'
  );
};

export const useOptimizedReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const text = useLocalizedText();

  const rateArgumentOptimized = async (argumentId: string, ratingType: 'insightful' | 'concede_point') => {
    if (!user) {
      toast({
        title: text('Sign-in required', 'Anmeldung erforderlich'),
        description: text('You must be signed in to rate.', 'Sie mussen angemeldet sein, um zu bewerten.'),
        variant: "destructive"
      });
      return;
    }

    // Use optimized rate limiting check
    const { data: rateLimitCheck } = await supabase.rpc('check_rate_limit_optimized', {
      p_user_id: user.id,
      p_action_type: 'rate_argument',
      p_max_count: 10,
      p_window_minutes: 5
    });

    if (!rateLimitCheck) {
      toast({
        title: text('Too many ratings', 'Zu viele Bewertungen'),
        description: text('Please wait before submitting more ratings.', 'Bitte warten Sie, bevor Sie weitere Bewertungen abgeben.'),
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Use the secure RPC function with optimized performance
      const { data, error } = await supabase.rpc('secure_rate_argument', {
        p_argument_id: argumentId,
        p_rating_type: ratingType,
        p_user_id: user.id
      });

      if (error) throw error;

      // Safe type checking instead of direct casting
      if (!isRateArgumentResponse(data)) {
        toast({
          title: text('Rating not possible', 'Bewertung nicht moglich'),
          description: text('Unexpected server response.', 'Unerwartete Antwort vom Server.'),
          variant: "destructive"
        });
        return;
      }

      if (!data.success) {
        toast({
          title: text('Rating not possible', 'Bewertung nicht moglich'),
          description: data.message || text('The rating could not be submitted.', 'Die Bewertung konnte nicht abgegeben werden.'),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: text('Rating submitted', 'Bewertung erfolgreich'),
        description: text(`+${data.points_awarded || 0} reputation points awarded.`, `+${data.points_awarded || 0} Reputationspunkte vergeben.`)
      });

    } catch (error: unknown) {
      console.error('Error rating argument:', error);
      toast({
        title: text('Failed to submit rating', 'Fehler beim Bewerten'),
        description: text('Could not process rating.', 'Die Bewertung konnte nicht verarbeitet werden.'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    rateArgument: rateArgumentOptimized,
    loading
  };
};
