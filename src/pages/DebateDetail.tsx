
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedArgumentCard } from '@/components/EnhancedArgumentCard';
import { EnhancedArgumentForm } from '@/components/EnhancedArgumentForm';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { useAdvancedCache } from '@/hooks/useAdvancedCache';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Users, MessageSquare, TrendingUp } from 'lucide-react';

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
  const { trackPageView, trackInteraction } = useAnalytics();

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
        // Optionally refresh arguments to show updated ratings
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

  if (debateLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Lade Debatte...</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Debatte nicht gefunden</h1>
          <p className="text-muted-foreground">Die angeforderte Debatte existiert nicht oder wurde entfernt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      
      <div className="container mx-auto px-4 py-8">
        {/* Debate Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{debate.titel}</CardTitle>
                {debate.beschreibung && (
                  <p className="text-muted-foreground">{debate.beschreibung}</p>
                )}
              </div>
              <Badge variant="secondary" className="ml-4">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(debate.erstellt_am).toLocaleDateString('de-DE')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{argumentsList.length} Argumente</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{new Set(argumentsList.map(a => a.benutzer_id)).size} Teilnehmer</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Aktiv</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Argument Form */}
        <div className="mb-8">
          <EnhancedArgumentForm 
            debateId={id!} 
            onSuccess={handleArgumentSuccess}
          />
        </div>

        {argumentsLoading && argumentsList.length === 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Lade Argumente...</p>
          </div>
        )}

        {/* Arguments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pro Arguments */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
              👍 Pro-Argumente ({proArguments.length})
            </h2>
            <div className="space-y-4">
              {proArguments.map((argument) => (
                <EnhancedArgumentCard
                  key={`${argument.id}-${refreshKey}`}
                  id={argument.id}
                  title={argument.argument_text.substring(0, 50) + (argument.argument_text.length > 50 ? '...' : '')}
                  content={argument.argument_text}
                  type={argument.argument_typ}
                  author={argument.autor_name || 'Anonym'}
                  authorUserId={argument.benutzer_id}
                  createdAt={argument.erstellt_am}
                  debateId={id!}
                  childArguments={argument.children?.map((child: any) => ({
                    id: child.id,
                    title: child.argument_text.substring(0, 30) + '...',
                    content: child.argument_text,
                    type: child.argument_typ
                  })) || []}
                />
              ))}
              {proArguments.length === 0 && (
                <Card className="text-center py-8 border-dashed">
                  <CardContent>
                    <p className="text-muted-foreground">
                      Noch keine Pro-Argumente vorhanden. Sei der Erste!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Contra Arguments */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center gap-2">
              👎 Contra-Argumente ({contraArguments.length})
            </h2>
            <div className="space-y-4">
              {contraArguments.map((argument) => (
                <EnhancedArgumentCard
                  key={`${argument.id}-${refreshKey}`}
                  id={argument.id}
                  title={argument.argument_text.substring(0, 50) + (argument.argument_text.length > 50 ? '...' : '')}
                  content={argument.argument_text}
                  type={argument.argument_typ}
                  author={argument.autor_name || 'Anonym'}
                  authorUserId={argument.benutzer_id}
                  createdAt={argument.erstellt_am}
                  debateId={id!}
                  childArguments={argument.children?.map((child: any) => ({
                    id: child.id,
                    title: child.argument_text.substring(0, 30) + '...',
                    content: child.argument_text,
                    type: child.argument_typ
                  })) || []}
                />
              ))}
              {contraArguments.length === 0 && (
                <Card className="text-center py-8 border-dashed">
                  <CardContent>
                    <p className="text-muted-foreground">
                      Noch keine Contra-Argumente vorhanden. Starte die Diskussion!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateDetail;
