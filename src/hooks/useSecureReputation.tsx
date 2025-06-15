
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { InputValidator } from '@/utils/inputValidation';

export const useSecureReputation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const rateArgumentSecurely = async (argumentId: string, ratingType: 'insightful' | 'concede_point') => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um zu bewerten.",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting for ratings
    if (!InputValidator.checkRateLimit(user.id, 'rate_argument', 10, 300000)) { // 10 ratings per 5 minutes
      toast({
        title: "Zu viele Bewertungen",
        description: "Bitte warten Sie, bevor Sie weitere Bewertungen abgeben.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Use secure RPC function that includes additional validation
      const { data, error } = await supabase.rpc('secure_rate_argument' as any, {
        p_argument_id: argumentId,
        p_rating_type: ratingType,
        p_user_id: user.id
      });

      if (error) throw error;

      if (!data || !data.success) {
        toast({
          title: "Bewertung nicht möglich",
          description: data?.message || "Die Bewertung konnte nicht abgegeben werden.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Bewertung erfolgreich",
        description: `+${data.points_awarded || 0} Reputationspunkte vergeben.`
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
    rateArgument: rateArgumentSecurely,
    loading
  };
};
