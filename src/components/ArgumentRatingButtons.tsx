
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useReputation } from '@/hooks/useReputation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Award, CheckCircle } from 'lucide-react';

interface ArgumentRatingButtonsProps {
  argumentId: string;
  authorUserId: string;
}

export const ArgumentRatingButtons = ({ argumentId, authorUserId }: ArgumentRatingButtonsProps) => {
  const { rateArgument, loading } = useReputation();
  const { user } = useAuth();
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

  useEffect(() => {
    if (!user) return;
    fetchRatings();
  }, [argumentId, user]);

  const fetchRatings = async () => {
    if (!user) return;

    try {
      // Hole alle Bewertungen für dieses Argument
      const { data: allRatings } = await supabase
        .from('argument_ratings')
        .select('*')
        .eq('argument_id', argumentId);

      // Prüfe, ob der aktuelle Benutzer bereits bewertet hat
      const userInsightfulRating = allRatings?.find(r => 
        r.rated_by_user_id === user.id && r.rating_type === 'insightful'
      );
      const userConcedeRating = allRatings?.find(r => 
        r.rated_by_user_id === user.id && r.rating_type === 'concede_point'
      );

      // Zähle Bewertungen
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
  };

  const handleRating = async (ratingType: 'insightful' | 'concede_point') => {
    await rateArgument(argumentId, ratingType);
    await fetchRatings();
  };

  // Verstecke Buttons für eigene Argumente
  if (user?.id === authorUserId) {
    return null;
  }

  // Verstecke Buttons für nicht angemeldete Benutzer
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={ratings.hasRatedInsightful ? "default" : "outline"}
        size="sm"
        onClick={() => handleRating('insightful')}
        disabled={loading || ratings.hasRatedInsightful}
        className="gap-1"
      >
        {ratings.hasRatedInsightful ? <CheckCircle className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
        Einsichtig ({ratings.insightfulCount})
      </Button>
      
      <Button
        variant={ratings.hasConcedePoint ? "default" : "outline"}
        size="sm"
        onClick={() => handleRating('concede_point')}
        disabled={loading || ratings.hasConcedePoint}
        className="gap-1"
      >
        {ratings.hasConcedePoint ? <CheckCircle className="h-3 w-3" /> : <Award className="h-3 w-3" />}
        Punkt zugestehen ({ratings.concedePointCount})
      </Button>
    </div>
  );
};
