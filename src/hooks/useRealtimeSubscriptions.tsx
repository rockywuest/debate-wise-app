
import { useCallback, useEffect, useState } from 'react';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/utils/i18n';

interface RealtimeConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onUpdate?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
}

export const useRealtimeSubscriptions = (configs: RealtimeConfig[]) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTranslation();
  const text = useCallback((en: string, de: string) => (language === 'de' ? de : en), [language]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    if (!user) return;

    setConnectionStatus('connecting');
    const subscriptions: RealtimeChannel[] = [];

    configs.forEach((config) => {
      const { table, event = '*', filter, onUpdate } = config;
      
      const subscription = supabase
        .channel(`realtime-${table}`)
        .on(
          'postgres_changes',
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
                    title: text('New activity', 'Neue Aktivitat'),
                    description: text(`New entry in ${table}`, `Neuer Eintrag in ${table}`),
                  });
                  break;
                case 'UPDATE':
                  toast({
                    title: text('Update', 'Aktualisierung'),
                    description: text(`Entry in ${table} was updated`, `Eintrag in ${table} wurde aktualisiert`),
                  });
                  break;
                case 'DELETE':
                  toast({
                    title: text('Deleted', 'Geloscht'),
                    description: text(`Entry removed from ${table}`, `Eintrag aus ${table} wurde entfernt`),
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
      subscriptions.forEach((subscriptionChannel) => {
        supabase.removeChannel(subscriptionChannel);
      });
      setConnectionStatus('disconnected');
    };
  }, [user, configs, toast, text]);

  return { connectionStatus };
};
