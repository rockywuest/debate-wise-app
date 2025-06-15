
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Define the expected response type from the RPC function
interface RateArgumentResponse {
  success: boolean;
  message?: string;
  points_awarded?: number;
}

export const useOptimizedReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const rateArgumentOptimized = async (argumentId: string, ratingType: 'insightful' | 'concede_point') => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um zu bewerten.",
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
        title: "Zu viele Bewertungen",
        description: "Bitte warten Sie, bevor Sie weitere Bewertungen abgeben.",
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

      // Type guard to ensure data is the expected object type
      const result = data as RateArgumentResponse;

      if (!result || !result.success) {
        toast({
          title: "Bewertung nicht möglich",
          description: result?.message || "Die Bewertung konnte nicht abgegeben werden.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Bewertung erfolgreich",
        description: `+${result.points_awarded || 0} Reputationspunkte vergeben.`
      });

    } catch (error: any) {
      console.error('Error rating argument:', error);
      toast({
        title: "Fehler beim Bewerten",
        description: "Die Bewertung konnte nicht verarbeitet werden.",
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
