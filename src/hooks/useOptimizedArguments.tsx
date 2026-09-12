
import { useCallback, useEffect, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { InputValidator } from '@/utils/inputValidation';
import { useLocalizedText } from '@/utils/i18n';
import { organizeArgumentsHierarchically, type Argument } from './useArguments';

// Wie loadArguments in useArguments, aber mit dem indexgestuetzten Join auf
// profiles. Faesst keinen React-State an, damit der Effect das Ergebnis erst
// NACH dem await schreiben kann (react-hooks/set-state-in-effect).
const loadOptimizedArguments = async (debateId: string): Promise<Argument[]> => {
  const { data, error } = await supabase
    .from('argumente')
    .select(`
      *,
      profiles!inner(username, reputation_score)
    `)
    .eq('debatten_id', debateId)
    .order('erstellt_am', { ascending: true });

  if (error) throw error;
  return organizeArgumentsHierarchically(data || []);
};

export const useOptimizedArguments = (debateId?: string) => {
  // loadedFor haelt fest, zu welcher Debatte die Daten gehoeren. Daraus laesst
  // sich loading ableiten, statt ein eigenes Flag im Effect synchron zu setzen.
  const [state, setState] = useState<{ loadedFor: string | null; args: Argument[] }>({
    loadedFor: null,
    args: [],
  });
  const debateArguments = state.args;
  const loading = Boolean(debateId) && state.loadedFor !== debateId;
  const [creating, setCreating] = useState(false);
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

  const reportLoadFailure = useCallback(
    (error: unknown) => {
      console.error('Error fetching arguments:', error);
      toast({
        title: text('Failed to load arguments', 'Fehler beim Laden der Argumente'),
        description: getErrorMessage(error),
        variant: "destructive"
      });
    },
    [getErrorMessage, toast, text]
  );

  // Manuelles Neuladen — aus Event-Handlern und aus dem Realtime-Callback.
  // Beides laeuft nicht im synchronen Effect-Rumpf, setState ist hier erlaubt.
  const fetchArguments = useCallback(async () => {
    if (!debateId) return;

    try {
      setState({ loadedFor: debateId, args: await loadOptimizedArguments(debateId) });
    } catch (error: unknown) {
      reportLoadFailure(error);
      setState(prev => ({ ...prev, loadedFor: debateId }));
    }
  }, [debateId, reportLoadFailure]);

  const createOptimizedArgument = async (
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

    // Client-side rate limiting check first
    if (!InputValidator.checkRateLimit(user.id, 'create_argument', 3, 60000)) {
      toast({
        title: text('Too many requests', 'Zu viele Anfragen'),
        description: text('Please wait one minute before creating another argument.', 'Bitte warten Sie eine Minute, bevor Sie ein neues Argument erstellen.'),
        variant: "destructive"
      });
      return null;
    }

    // Validate and sanitize input
    const argumentValidation = InputValidator.validateAndSanitizeArgument(argumentText);
    if (!argumentValidation.isValid) {
      toast({
        title: text('Invalid argument', 'Ungultiges Argument'),
        description: argumentValidation.errors.join(', '),
        variant: "destructive"
      });
      return null;
    }

    try {
      setCreating(true);

      // Use the optimized server-side validation
      const { data: validationResult, error: validationError } = await supabase
        .rpc('validate_argument_creation', {
          p_user_id: user.id,
          p_debate_id: debateId,
          p_argument_text: argumentValidation.sanitizedValue!
        });

      if (validationError || !validationResult) {
        throw new Error(text('Argument could not be validated.', 'Argument konnte nicht validiert werden'));
      }

      const { data, error } = await supabase
        .from('argumente')
        .insert({
          debatten_id: debateId,
          eltern_id: parentId,
          argument_text: argumentValidation.sanitizedValue!,
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

      return data;
    } catch (error: unknown) {
      console.error('Error creating argument:', error);
      toast({
        title: text('Failed to create argument', 'Fehler beim Erstellen des Arguments'),
        description: getErrorMessage(error),
        variant: "destructive"
      });
      return null;
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (!debateId) return;

    let cancelled = false;
    (async () => {
      try {
        const args = await loadOptimizedArguments(debateId);
        if (!cancelled) setState({ loadedFor: debateId, args });
      } catch (error: unknown) {
        if (cancelled) return;
        reportLoadFailure(error);
        setState(prev => ({ ...prev, loadedFor: debateId }));
      }
    })();
    // Debattenwechsel oder Unmount waehrend eines laufenden Abrufs darf das
    // alte Ergebnis nicht mehr einspielen.
    return () => {
      cancelled = true;
    };
  }, [debateId, reportLoadFailure]);

  useEffect(() => {
    if (!debateId) return;

    let channel: RealtimeChannel | null = null;

    const setupOptimizedRealtimeSubscription = async () => {
      try {
        const channelName = `optimized-arguments-${debateId}-${Math.random().toString(36).substr(2, 9)}`;
        
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
              console.log('Optimized real-time argument change:', payload);
              // Debounced re-fetch for better performance
              setTimeout(() => fetchArguments(), 100);
            }
          );

        await channel.subscribe();
      } catch (error) {
        console.error('Error setting up optimized realtime subscription:', error);
      }
    };

    setupOptimizedRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [debateId, fetchArguments]);

  return {
    arguments: debateArguments,
    loading,
    creating,
    fetchArguments,
    createArgument: createOptimizedArgument
  };
};
