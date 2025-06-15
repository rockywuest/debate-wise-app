
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrendingDebate {
  id: string;
  titel: string;
  beschreibung?: string;
  erstellt_am: string;
  activity_score: number;
  argument_count: number;
  participant_count: number;
  recent_activity: string;
}

export const useTrendingDebates = (activeTab: 'trending' | 'active' | 'recent') => {
  const [trendingDebates, setTrendingDebates] = useState<TrendingDebate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingDebates();
  }, [activeTab]);

  const fetchTrendingDebates = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('debatten')
        .select(`
          id,
          titel,
          beschreibung,
          erstellt_am
        `);

      const { data: debatesData, error: debatesError } = await query;
      if (debatesError) throw debatesError;

      if (!debatesData || debatesData.length === 0) {
        setTrendingDebates([]);
        return;
      }

      // Calculate activity metrics for each debate
      const debatesWithMetrics = await Promise.all(
        debatesData.map(async (debate) => {
          const { data: argumentsData } = await supabase
            .from('argumente')
            .select('benutzer_id, erstellt_am')
            .eq('debatten_id', debate.id);

          const argumentCount = argumentsData?.length || 0;
          const participantCount = new Set(argumentsData?.map(arg => arg.benutzer_id)).size;
          
          // Calculate activity score based on recent engagement
          const now = new Date();
          const recentArgs = argumentsData?.filter(arg => {
            const argDate = new Date(arg.erstellt_am);
            const hoursDiff = (now.getTime() - argDate.getTime()) / (1000 * 60 * 60);
            return hoursDiff <= 168; // Last 7 days
          }) || [];

          const activityScore = recentArgs.length * 10 + participantCount * 5;
          const recentActivity = argumentsData && argumentsData.length > 0
            ? argumentsData.sort((a, b) => new Date(b.erstellt_am).getTime() - new Date(a.erstellt_am).getTime())[0].erstellt_am
            : debate.erstellt_am;

          return {
            ...debate,
            activity_score: activityScore,
            argument_count: argumentCount,
            participant_count: participantCount,
            recent_activity: recentActivity
          };
        })
      );

      // Sort based on active tab
      let sortedDebates = [...debatesWithMetrics];
      switch (activeTab) {
        case 'trending':
          sortedDebates.sort((a, b) => b.activity_score - a.activity_score);
          break;
        case 'active':
          sortedDebates.sort((a, b) => new Date(b.recent_activity).getTime() - new Date(a.recent_activity).getTime());
          break;
        case 'recent':
          sortedDebates.sort((a, b) => new Date(b.erstellt_am).getTime() - new Date(a.erstellt_am).getTime());
          break;
      }

      setTrendingDebates(sortedDebates.slice(0, 6));
    } catch (error) {
      console.error('Error fetching trending debates:', error);
    } finally {
      setLoading(false);
    }
  };

  return { trendingDebates, loading };
};
