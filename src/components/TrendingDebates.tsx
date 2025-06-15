
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DebateCard } from './DebateCard';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/utils/i18n';
import { TrendingUp, Flame, Clock, Users, MessageSquare } from 'lucide-react';

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

export const TrendingDebates = () => {
  const [trendingDebates, setTrendingDebates] = useState<TrendingDebate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'active' | 'recent'>('trending');
  const { t, language } = useTranslation();

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

      // Get arguments data to calculate activity scores
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

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'trending':
        return <Flame className="h-4 w-4" />;
      case 'active':
        return <TrendingUp className="h-4 w-4" />;
      case 'recent':
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'trending':
        return language === 'de' ? 'Trending' : 'Trending';
      case 'active':
        return language === 'de' ? 'Aktiv' : 'Active';
      case 'recent':
        return language === 'de' ? 'Neueste' : 'Recent';
      default:
        return '';
    }
  };

  const formatMetrics = (debate: TrendingDebate) => {
    return (
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          <span>{debate.argument_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{debate.participant_count}</span>
        </div>
        {debate.activity_score > 0 && (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
            <Flame className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5" />
            {language === 'de' ? 'Entdecke Debatten' : 'Discover Debates'}
          </CardTitle>
          
          <div className="flex gap-1">
            {(['trending', 'active', 'recent'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="gap-1"
              >
                {getTabIcon(tab)}
                {getTabTitle(tab)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : trendingDebates.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === 'de' ? 'Keine Debatten gefunden.' : 'No debates found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingDebates.map((debate) => (
              <div key={debate.id} className="space-y-2">
                <DebateCard
                  id={debate.id}
                  title={debate.titel}
                  description={debate.beschreibung}
                  createdAt={debate.erstellt_am}
                  language={language}
                />
                {formatMetrics(debate)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
