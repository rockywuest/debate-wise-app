
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedArgumentForm } from '@/components/EnhancedArgumentForm';
import { ModernDebateThread } from '@/components/ModernDebateThread';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { useAdvancedCache } from '@/hooks/useAdvancedCache';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from '@/utils/i18n';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Users, MessageSquare, TrendingUp, Plus } from 'lucide-react';

interface Debate {
  id: string;
  titel: string;
  beschreibung?: string;
  erstellt_von: string;
  erstellt_am: string;
}

interface Argument {
  id: string;
  argument_text: string;
  argument_typ: 'pro' | 'contra' | 'neutral';
  autor_name?: string;
  benutzer_id: string;
  erstellt_am: string;
  eltern_id?: string;
}

const DebateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [argumentsList, setArgumentsList] = useState<Argument[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showArgumentForm, setShowArgumentForm] = useState(false);
  const { trackPageView, trackInteraction } = useAnalytics();
  const { t, language } = useTranslation();

  // Advanced caching for debate data
  const { 
    data: debate, 
    loading: debateLoading, 
    getData: getDebate,
    invalidateCache: invalidateDebateCache 
  } = useAdvancedCache<Debate>(
    `debate_${id}`,
    async () => {
      const { data, error } = await supabase
        .from('debatten')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    { ttl: 10 * 60 * 1000 } // 10 minutes cache
  );

  // Advanced caching for arguments
  const { 
    data: cachedArguments, 
    loading: argumentsLoading, 
    getData: getArguments,
    invalidateCache: invalidateArgumentsCache 
  } = useAdvancedCache<Argument[]>(
    `arguments_${id}`,
    async () => {
      const { data, error } = await supabase
        .from('argumente')
        .select(`
          id,
          argument_text,
          argument_typ,
          autor_name,
          benutzer_id,
          erstellt_am,
          eltern_id
        `)
        .eq('debatten_id', id)
        .order('erstellt_am', { ascending: true });
      
      if (error) throw error;
      return data?.map(item => ({
        ...item,
        argument_typ: item.argument_typ === 'Pro' ? 'pro' as const : 
                     item.argument_typ === 'Contra' ? 'contra' as const : 
                     'neutral' as const
      })) || [];
    },
    { ttl: 2 * 60 * 1000 } // 2 minutes cache for arguments
  );

  // Real-time subscriptions
  useRealtimeSubscriptions([
    {
      table: 'argumente',
      filter: `debatten_id=eq.${id}`,
      onUpdate: (payload) => {
        console.log('Arguments updated:', payload);
        invalidateArgumentsCache();
        getArguments();
        trackInteraction('realtime_argument_update', { debate_id: id });
      }
    },
    {
      table: 'argument_ratings',
      onUpdate: (payload) => {
        console.log('Ratings updated:', payload);
        setRefreshKey(prev => prev + 1);
        trackInteraction('realtime_rating_update', { debate_id: id });
      }
    }
  ]);

  useEffect(() => {
    if (id) {
      getDebate();
      getArguments().then(data => {
        if (data) setArgumentsList(data);
      });
      trackPageView(`debate_detail_${id}`);
    }
  }, [id, getDebate, getArguments, trackPageView]);

  useEffect(() => {
    if (cachedArguments) {
      setArgumentsList(cachedArguments);
    }
  }, [cachedArguments]);

  const handleArgumentSuccess = () => {
    invalidateArgumentsCache();
    getArguments().then(data => {
      if (data) setArgumentsList(data);
    });
    trackInteraction('argument_created', { debate_id: id });
    setShowArgumentForm(false);
  };

  const organizeArguments = (args: Argument[]) => {
    const argumentMap = new Map();
    const rootArguments: any[] = [];

    // First pass: create argument objects
    args.forEach(arg => {
      argumentMap.set(arg.id, {
        ...arg,
        children: []
      });
    });

    // Second pass: organize hierarchy
    args.forEach(arg => {
      if (arg.eltern_id && argumentMap.has(arg.eltern_id)) {
        argumentMap.get(arg.eltern_id).children.push(argumentMap.get(arg.id));
      } else {
        rootArguments.push(argumentMap.get(arg.id));
      }
    });

    return rootArguments;
  };

  const organizedArguments = organizeArguments(argumentsList);
  const proArguments = organizedArguments.filter(arg => arg.argument_typ === 'pro');
  const contraArguments = organizedArguments.filter(arg => arg.argument_typ === 'contra');
  const neutralArguments = organizedArguments.filter(arg => arg.argument_typ === 'neutral');

  if (debateLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('debate.loadingDebate')}</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('debate.notFound')}</h1>
          <p className="text-muted-foreground">{t('debate.notFoundDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Modern Debate Header */}
        <Card className="mb-8 border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-3 text-balance">{debate.titel}</CardTitle>
                {debate.beschreibung && (
                  <p className="text-muted-foreground text-lg leading-relaxed">{debate.beschreibung}</p>
                )}
              </div>
              <Badge variant="secondary" className="ml-4 px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(debate.erstellt_am).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{argumentsList.length} Argumente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{new Set(argumentsList.map(a => a.benutzer_id)).size} Teilnehmer</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Aktiv</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowArgumentForm(!showArgumentForm)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Argument hinzufügen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Collapsible Add Argument Form */}
        {showArgumentForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <EnhancedArgumentForm 
                debateId={id!} 
                onSuccess={handleArgumentSuccess}
              />
            </CardContent>
          </Card>
        )}

        {argumentsLoading && argumentsList.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t('debate.loadingArguments')}</p>
          </div>
        )}

        {/* Modern Single-Column Thread Layout */}
        <div className="space-y-8">
          {/* Pro Arguments Section */}
          {proArguments.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                  Pro-Argumente ({proArguments.length})
                </h2>
              </div>
              <ModernDebateThread arguments={proArguments} debateId={id!} />
            </section>
          )}

          {/* Contra Arguments Section */}
          {contraArguments.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                  Contra-Argumente ({contraArguments.length})
                </h2>
              </div>
              <ModernDebateThread arguments={contraArguments} debateId={id!} />
            </section>
          )}

          {/* Neutral Arguments Section */}
          {neutralArguments.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  Neutrale Argumente ({neutralArguments.length})
                </h2>
              </div>
              <ModernDebateThread arguments={neutralArguments} debateId={id!} />
            </section>
          )}

          {/* Empty State */}
          {argumentsList.length === 0 && !argumentsLoading && (
            <Card className="text-center py-12 border-dashed">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Noch keine Argumente</h3>
                <p className="text-muted-foreground mb-6">
                  Seien Sie der Erste, der zu dieser Debatte beiträgt.
                </p>
                <Button onClick={() => setShowArgumentForm(true)}>
                  Erstes Argument hinzufügen
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;
