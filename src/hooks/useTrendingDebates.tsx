
import { useEffect, useState } from 'react';
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

// Laedt und sortiert die Debatten, ohne React-State anzufassen. Dadurch kann der
// Effect das Ergebnis erst NACH dem await in den State schreiben — ein synchrones
// setState im Effect-Rumpf loest sonst eine Renderkaskade aus
// (react-hooks/set-state-in-effect).
const loadTrendingDebates = async (
  activeTab: 'trending' | 'active' | 'recent'
): Promise<TrendingDebate[]> => {
  const query = supabase
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
    return [];
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
  const sortedDebates = [...debatesWithMetrics].sort((a, b) => {
    switch (activeTab) {
      case 'trending':
        return b.activity_score - a.activity_score;
      case 'active':
        return new Date(b.recent_activity).getTime() - new Date(a.recent_activity).getTime();
      case 'recent':
      default:
        return new Date(b.erstellt_am).getTime() - new Date(a.erstellt_am).getTime();
    }
  });

  return sortedDebates.slice(0, 6);
};

export const useTrendingDebates = (activeTab: 'trending' | 'active' | 'recent') => {
  // Tab und Daten liegen zusammen im State, damit sich loading ableiten laesst:
  // solange die geladenen Daten zu einem anderen Tab gehoeren, laeuft noch ein
  // Abruf. Ein eigenes loading-Flag muesste im Effect synchron gesetzt werden.
  const [state, setState] = useState<{
    tab: 'trending' | 'active' | 'recent' | null;
    debates: TrendingDebate[];
  }>({ tab: null, debates: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const debates = await loadTrendingDebates(activeTab);
        if (!cancelled) setState({ tab: activeTab, debates });
      } catch (error) {
        console.error('Error fetching trending debates:', error);
        if (!cancelled) setState({ tab: activeTab, debates: [] });
      }
    })();
    // Ein Tabwechsel waehrend eines laufenden Abrufs darf das alte Ergebnis
    // nicht mehr einspielen.
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return { trendingDebates: state.debates, loading: state.tab !== activeTab };
};
