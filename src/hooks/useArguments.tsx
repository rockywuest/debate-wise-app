import { useCallback, useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedText } from '@/utils/i18n';

export interface Argument {
  id: string;
  debatten_id: string;
  eltern_id?: string | null;
  argument_text: string;
  argument_typ: 'These' | 'Pro' | 'Contra';
  benutzer_id: string;
  autor_name?: string | null;
  erstellt_am: string;
  aktualisiert_am: string;
  childArguments?: Argument[];
}

export const useArguments = (debateId?: string) => {
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const text = useLocalizedText();
  const defaultErrorMessage = text('An unexpected error occurred.', 'Ein unerwarteter Fehler ist aufgetreten.');

  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return defaultErrorMessage;
  }, [defaultErrorMessage]);

  const organizeArgumentsHierarchically = (data: Argument[]) => {
    const topLevelArgs = data.filter(arg => !arg.eltern_id);
    const childArgs = data.filter(arg => arg.eltern_id);

    return topLevelArgs.map(parent => ({
      ...parent,
      childArguments: childArgs.filter(child => child.eltern_id === parent.id)
    }));
  };

  const fetchArguments = useCallback(async () => {
    if (!debateId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('argumente')
        .select('*')
        .eq('debatten_id', debateId)
        .order('erstellt_am', { ascending: true });

      if (error) throw error;

      const argumentsWithChildren = organizeArgumentsHierarchically(data || []);
      setDebateArguments(argumentsWithChildren);
    } catch (error: unknown) {
      console.error('Error fetching arguments:', error);
      toast({
        title: text('Failed to load arguments', 'Fehler beim Laden der Argumente'),
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [debateId, getErrorMessage, toast, text]);

  const createArgument = async (
    argumentText: string,
    argumentTyp: 'These' | 'Pro' | 'Contra',
    parentId?: string,
    autorName?: string
  ) => {
    if (!user || !debateId) {
      toast({
        title: text('Sign-in required', 'Anmeldung erforderlich'),
        description: text('You must be signed in to create an argument.', 'Sie mussen angemeldet sein, um ein Argument zu erstellen.'),
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('argumente')
        .insert({
          debatten_id: debateId,
          eltern_id: parentId,
          argument_text: argumentText,
          argument_typ: argumentTyp,
          benutzer_id: user.id,
          autor_name: autorName
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: text('Argument added', 'Argument hinzugefugt'),
        description: text('The new argument was created successfully.', 'Das neue Argument wurde erfolgreich erstellt.')
      });

      // No need to manually refresh as real-time will handle it
      return data;
    } catch (error: unknown) {
      console.error('Error creating argument:', error);
      toast({
        title: text('Failed to create argument', 'Fehler beim Erstellen des Arguments'),
        description: getErrorMessage(error),
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchArguments();
  }, [fetchArguments]);

  useEffect(() => {
    if (!debateId) return;

    let channel: RealtimeChannel | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        // Create a unique channel name to avoid conflicts
        const channelName = `arguments-${debateId}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Set up real-time subscription for arguments
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'argumente',
              filter: `debatten_id=eq.${debateId}`
            },
            (payload) => {
              console.log('Real-time argument change:', payload);
              
              // Re-fetch all arguments to maintain proper hierarchy
              // This ensures we don't have race conditions with hierarchical data
              fetchArguments();
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
  }, [debateId, fetchArguments]);

  return {
    arguments: debateArguments,
    loading,
    fetchArguments,
    createArgument
  };
};
