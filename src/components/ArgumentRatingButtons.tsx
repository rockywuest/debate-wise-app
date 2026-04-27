
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useReputation } from '@/hooks/useReputation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocalizedText } from '@/utils/i18n';
import { Heart, Award, CheckCircle } from 'lucide-react';

interface ArgumentRatingButtonsProps {
  argumentId: string;
  authorUserId: string;
}

interface ArgumentRating {
  rated_by_user_id: string;
  rating_type: 'insightful' | 'concede_point';
}

export const ArgumentRatingButtons = ({ argumentId, authorUserId }: ArgumentRatingButtonsProps) => {
  const { rateArgument, loading } = useReputation();
  const { user } = useAuth();
  const text = useLocalizedText();

  const { data: allRatings = [], refetch } = useQuery<ArgumentRating[]>({
    queryKey: ['argument-ratings', 'reputation', argumentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('argument_ratings')
        .select('rated_by_user_id, rating_type')
        .eq('argument_id', argumentId);
      if (error) throw error;
      return (data ?? []) as ArgumentRating[];
    },
    enabled: !!user,
  });

  const hasRatedInsightful = allRatings.some(
    r => r.rated_by_user_id === user?.id && r.rating_type === 'insightful',
  );
  const hasConcedePoint = allRatings.some(
    r => r.rated_by_user_id === user?.id && r.rating_type === 'concede_point',
  );
  const insightfulCount = allRatings.filter(r => r.rating_type === 'insightful').length;
  const concedePointCount = allRatings.filter(r => r.rating_type === 'concede_point').length;

  useEffect(() => {
    if (!user) return;

    const channelName = `ratings-${argumentId}-${Math.random().toString(36).slice(2, 11)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'argument_ratings',
          filter: `argument_id=eq.${argumentId}`,
        },
        () => {
          refetch();
        },
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [argumentId, user, refetch]);

  const handleRating = async (ratingType: 'insightful' | 'concede_point') => {
    await rateArgument(argumentId, ratingType);
  };

  // Hide buttons on own arguments or anonymous users.
  if (!user || user.id === authorUserId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={hasRatedInsightful ? "default" : "outline"}
        size="sm"
        onClick={() => handleRating('insightful')}
        disabled={loading || hasRatedInsightful}
        className="gap-1"
      >
        {hasRatedInsightful ? <CheckCircle className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
        {text('Insightful', 'Einsichtig')} ({insightfulCount})
      </Button>

      <Button
        variant={hasConcedePoint ? "default" : "outline"}
        size="sm"
        onClick={() => handleRating('concede_point')}
        disabled={loading || hasConcedePoint}
        className="gap-1"
      >
        {hasConcedePoint ? <CheckCircle className="h-3 w-3" /> : <Award className="h-3 w-3" />}
        {text('Concede point', 'Punkt zugestehen')} ({concedePointCount})
      </Button>
    </div>
  );
};
