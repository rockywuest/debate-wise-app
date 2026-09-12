import { useCallback, useState, useEffect } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserProfile {
  id: string;
  username: string;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

// Laedt ein Profil, ohne React-State anzufassen. Dadurch kann der Effect das
// Ergebnis erst NACH dem await in den State schreiben — ein synchrones setState
// im Effect-Rumpf loest sonst eine Renderkaskade aus
// (react-hooks/set-state-in-effect). Ein Fehlschlag ist hier kein Sonderfall,
// sondern schlicht "kein Profil"; das entspricht dem bisherigen Verhalten.
const loadProfile = async (targetUserId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  // loadedFor haelt fest, zu welchem Nutzer die Daten gehoeren. Daraus laesst
  // sich loading ableiten, statt ein eigenes Flag im Effect synchron zu setzen.
  const [state, setState] = useState<{
    loadedFor: string | null;
    profile: UserProfile | null;
  }>({ loadedFor: null, profile: null });

  const profile = state.profile;
  // Ohne Nutzer gibt es nichts zu laden — dann ist der Hook sofort fertig.
  const loading = Boolean(targetUserId) && state.loadedFor !== targetUserId;

  useEffect(() => {
    if (!targetUserId) return;

    let cancelled = false;
    (async () => {
      const loaded = await loadProfile(targetUserId);
      if (!cancelled) setState({ loadedFor: targetUserId, profile: loaded });
    })();
    // Nutzerwechsel oder Unmount waehrend eines laufenden Abrufs darf das alte
    // Ergebnis nicht mehr einspielen.
    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  useEffect(() => {
    if (!targetUserId) return;

    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        // Create a unique channel name to avoid conflicts
        const channelName = `profile-${targetUserId}-${Math.random().toString(36).substr(2, 9)}`;

        // Set up real-time subscription for reputation score changes
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${targetUserId}`
            },
            (payload) => {
              console.log('Real-time profile change:', payload);
              if (payload.new) {
                setState({ loadedFor: targetUserId, profile: payload.new as UserProfile });
              }
            }
          );

        // Subscribe and wait for it to be ready
        await channel.subscribe();
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [targetUserId]);

  // Manuelles Neuladen aus Event-Handlern. setState ist hier unbedenklich,
  // weil der Aufruf nicht aus einem Effect kommt.
  const refetch = useCallback(async () => {
    if (!targetUserId) return;
    setState({ loadedFor: targetUserId, profile: await loadProfile(targetUserId) });
  }, [targetUserId]);

  return { profile, loading, refetch };
};
