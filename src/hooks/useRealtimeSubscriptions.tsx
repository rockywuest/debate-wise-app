
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface RealtimeConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onUpdate?: (payload: any) => void;
}

export const useRealtimeSubscriptions = (configs: RealtimeConfig[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (!user) return;

    setConnectionStatus('connecting');
    const subscriptions: any[] = [];

    configs.forEach((config) => {
      const { table, event = '*', filter, onUpdate } = config;
      
      let subscription = supabase
        .channel(`realtime-${table}`)
        .on(
          'postgres_changes' as any,
          {
            event,
            schema: 'public',
            table,
            filter
          },
          (payload) => {
            console.log(`Realtime update for ${table}:`, payload);
            
            // Handle different event types - check if payload has eventType property
            if ('eventType' in payload) {
              switch (payload.eventType) {
                case 'INSERT':
                  toast({
                    title: "Neue Aktivität",
                    description: `Neuer Eintrag in ${table}`,
                  });
                  break;
                case 'UPDATE':
                  toast({
                    title: "Aktualisierung",
                    description: `Eintrag in ${table} wurde aktualisiert`,
                  });
                  break;
                case 'DELETE':
                  toast({
                    title: "Gelöscht",
                    description: `Eintrag aus ${table} wurde entfernt`,
                  });
                  break;
              }
            }

            onUpdate?.(payload);
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for ${table}:`, status);
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
          } else if (status === 'CLOSED') {
            setConnectionStatus('disconnected');
          }
        });

      subscriptions.push(subscription);
    });

    return () => {
      subscriptions.forEach(sub => {
        supabase.removeChannel(sub);
      });
      setConnectionStatus('disconnected');
    };
  }, [user, configs, toast]);

  return { connectionStatus };
};
