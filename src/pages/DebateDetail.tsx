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
import { Clock, Users, MessageSquare, TrendingUp, Plus, ThumbsUp, ThumbsDown, Activity } from 'lucide-react';

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
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground font-medium">{t('debate.loadingDebate')}</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">{t('debate.notFound')}</h1>
            <p className="text-muted-foreground">{t('debate.notFoundDescription')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="debate-header p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl font-bold text-balance leading-tight">{debate.titel}</h1>
              {debate.beschreibung && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{debate.beschreibung}</p>
              )}
            </div>
            <Badge variant="secondary" className="ml-6 px-4 py-2 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              {new Date(debate.erstellt_am).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">{argumentsList.length} Argumente</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-medium">{new Set(argumentsList.map(a => a.benutzer_id)).size} Teilnehmer</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span className="font-medium">Aktive Diskussion</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowArgumentForm(!showArgumentForm)}
              className="modern-button modern-button-primary"
            >
              <Plus className="h-4 w-4" />
              Argument beitragen
            </Button>
          </div>
        </div>

        {/* Add Argument Form */}
        {showArgumentForm && (
          <Card className="mb-8 subtle-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Neues Argument hinzufügen</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedArgumentForm 
                debateId={id!} 
                onSuccess={handleArgumentSuccess}
              />
            </CardContent>
          </Card>
        )}

        {argumentsLoading && argumentsList.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground font-medium">{t('debate.loadingArguments')}</p>
          </div>
        )}

        {/* Arguments Sections */}
        <div className="space-y-12">
          {/* Pro Arguments */}
          {proArguments.length > 0 && (
            <section className="pro-section">
              <div className="section-header">
                <div className="section-icon">
                  <ThumbsUp className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  Pro-Argumente
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  {proArguments.length}
                </Badge>
              </div>
              <ModernDebateThread arguments={proArguments} debateId={id!} />
            </section>
          )}

          {/* Contra Arguments */}
          {contraArguments.length > 0 && (
            <section className="contra-section">
              <div className="section-header">
                <div className="section-icon">
                  <ThumbsDown className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                  Contra-Argumente
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  {contraArguments.length}
                </Badge>
              </div>
              <ModernDebateThread arguments={contraArguments} debateId={id!} />
            </section>
          )}

          {/* Neutral Arguments */}
          {neutralArguments.length > 0 && (
            <section className="neutral-section">
              <div className="section-header">
                <div className="section-icon">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  Neutrale Argumente
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  {neutralArguments.length}
                </Badge>
              </div>
              <ModernDebateThread arguments={neutralArguments} debateId={id!} />
            </section>
          )}

          {/* Empty State */}
          {argumentsList.length === 0 && !argumentsLoading && (
            <Card className="text-center py-16 border-dashed border-2">
              <CardContent>
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Diskussion starten</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Noch keine Argumente vorhanden. Starten Sie die Diskussion mit Ihrem ersten Beitrag.
                </p>
                <Button 
                  onClick={() => setShowArgumentForm(true)}
                  className="modern-button modern-button-primary"
                  size="lg"
                >
                  <Plus className="h-5 w-5" />
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
