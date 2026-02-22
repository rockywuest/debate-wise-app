
import React, { useCallback, useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useSecureReputation } from '@/hooks/useSecureReputation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocalizedText } from '@/utils/i18n';
import { Heart, Award, CheckCircle, Shield } from 'lucide-react';

interface SecureArgumentRatingButtonsProps {
  argumentId: string;
  authorUserId: string;
}

export const SecureArgumentRatingButtons = ({ argumentId, authorUserId }: SecureArgumentRatingButtonsProps) => {
  const { rateArgument, loading } = useSecureReputation();
  const { user } = useAuth();
  const text = useLocalizedText();
  const [ratings, setRatings] = useState<{
    hasRatedInsightful: boolean;
    hasConcedePoint: boolean;
    insightfulCount: number;
    concedePointCount: number;
  }>({
    hasRatedInsightful: false,
    hasConcedePoint: false,
    insightfulCount: 0,
    concedePointCount: 0
  });

  const fetchRatings = useCallback(async () => {
    if (!user) return;

    try {
      const { data: allRatings } = await supabase
        .from('argument_ratings')
        .select('*')
        .eq('argument_id', argumentId);

      const userInsightfulRating = allRatings?.find(r => 
        r.rated_by_user_id === user.id && r.rating_type === 'insightful'
      );
      const userConcedeRating = allRatings?.find(r => 
        r.rated_by_user_id === user.id && r.rating_type === 'concede_point'
      );

      const insightfulCount = allRatings?.filter(r => r.rating_type === 'insightful').length || 0;
      const concedePointCount = allRatings?.filter(r => r.rating_type === 'concede_point').length || 0;

      setRatings({
        hasRatedInsightful: !!userInsightfulRating,
        hasConcedePoint: !!userConcedeRating,
        insightfulCount,
        concedePointCount
      });
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, [argumentId, user]);

  const handleRating = async (ratingType: 'insightful' | 'concede_point') => {
    await rateArgument(argumentId, ratingType);
  };

  useEffect(() => {
    if (!user) return;
    fetchRatings();
  }, [fetchRatings, user]);

  useEffect(() => {
    if (!user) return;

    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        const channelName = `secure-ratings-${argumentId}-${Math.random().toString(36).substr(2, 9)}`;
        
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'argument_ratings',
              filter: `argument_id=eq.${argumentId}`
            },
            (payload) => {
              console.log('Real-time rating change:', payload);
              fetchRatings();
            }
          );

        await channel.subscribe();
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [argumentId, fetchRatings, user]);

  // Hide buttons for own arguments
  if (user?.id === authorUserId) {
    return null;
  }

  // Hide buttons for non-authenticated users
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 mr-2">
        <Shield className="h-3 w-3 text-green-600" />
        <span className="text-xs text-muted-foreground">{text('Securely validated', 'Sicher validiert')}</span>
      </div>
      
      <Button
        variant={ratings.hasRatedInsightful ? "default" : "outline"}
        size="sm"
        onClick={() => handleRating('insightful')}
        disabled={loading || ratings.hasRatedInsightful}
        className="gap-1"
      >
        {ratings.hasRatedInsightful ? <CheckCircle className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
        {text('Insightful', 'Einsichtig')} ({ratings.insightfulCount})
      </Button>
      
      <Button
        variant={ratings.hasConcedePoint ? "default" : "outline"}
        size="sm"
        onClick={() => handleRating('concede_point')}
        disabled={loading || ratings.hasConcedePoint}
        className="gap-1"
      >
        {ratings.hasConcedePoint ? <CheckCircle className="h-3 w-3" /> : <Award className="h-3 w-3" />}
        {text('Concede point', 'Punkt zugestehen')} ({ratings.concedePointCount})
      </Button>
    </div>
  );
};
