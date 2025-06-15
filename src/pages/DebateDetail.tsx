
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { DebateHeader } from '@/components/DebateHeader';
import { ArgumentFormSection } from '@/components/ArgumentFormSection';
import { ArgumentsSection } from '@/components/ArgumentsSection';
import { DebateEmptyState } from '@/components/DebateEmptyState';
import { LoadingState } from '@/components/LoadingState';
import { NotFoundState } from '@/components/NotFoundState';
import { useAdvancedCache } from '@/hooks/useAdvancedCache';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from '@/utils/i18n';
import { supabase } from '@/integrations/supabase/client';

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
    { ttl: 10 * 60 * 1000 }
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
    { ttl: 2 * 60 * 1000 }
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

    args.forEach(arg => {
      argumentMap.set(arg.id, {
        ...arg,
        children: []
      });
    });

    args.forEach(arg => {
      if (arg.eltern_id && argumentMap.has(arg.eltern_id)) {
        argumentMap.get(arg.eltern_id).children.push(argumentMap.get(arg.id));
      } else {
        rootArguments.push(argumentMap.get(arg.id));
      }
    });

    return rootArguments;
  };

  if (debateLoading) {
    return <LoadingState message={t('debate.loadingDebate')} />;
  }

  if (!debate) {
    return (
      <NotFoundState 
        title={t('debate.notFound')} 
        description={t('debate.notFoundDescription')} 
      />
    );
  }

  const organizedArguments = organizeArguments(argumentsList);
  const proArguments = organizedArguments.filter(arg => arg.argument_typ === 'pro');
  const contraArguments = organizedArguments.filter(arg => arg.argument_typ === 'contra');
  const neutralArguments = organizedArguments.filter(arg => arg.argument_typ === 'neutral');

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        <DebateHeader
          debate={debate}
          argumentsCount={argumentsList.length}
          participantsCount={new Set(argumentsList.map(a => a.benutzer_id)).size}
          language={language}
          onShowForm={() => setShowArgumentForm(!showArgumentForm)}
        />

        {showArgumentForm && (
          <ArgumentFormSection 
            debateId={id!} 
            onSuccess={handleArgumentSuccess}
          />
        )}

        {argumentsLoading && argumentsList.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground font-medium">{t('debate.loadingArguments')}</p>
          </div>
        )}

        <div className="space-y-12">
          <ArgumentsSection type="pro" arguments={proArguments} debateId={id!} />
          <ArgumentsSection type="contra" arguments={contraArguments} debateId={id!} />
          <ArgumentsSection type="neutral" arguments={neutralArguments} debateId={id!} />

          {argumentsList.length === 0 && !argumentsLoading && (
            <DebateEmptyState onAddArgument={() => setShowArgumentForm(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;
