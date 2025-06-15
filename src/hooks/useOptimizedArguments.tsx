
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { InputValidator } from '@/utils/inputValidation';
import type { Argument } from './useArguments';

export const useOptimizedArguments = (debateId?: string) => {
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const organizeArgumentsHierarchically = (data: any[]) => {
    const topLevelArgs = data.filter(arg => !arg.eltern_id);
    const childArgs = data.filter(arg => arg.eltern_id);

    return topLevelArgs.map(parent => ({
      ...parent,
      childArguments: childArgs.filter(child => child.eltern_id === parent.id)
    }));
  };

  const fetchArguments = async () => {
    if (!debateId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Use the optimized query with proper indexes
      const { data, error } = await supabase
        .from('argumente')
        .select(`
          *,
          profiles!inner(username, reputation_score)
        `)
        .eq('debatten_id', debateId)
        .order('erstellt_am', { ascending: true });

      if (error) throw error;

      const argumentsWithChildren = organizeArgumentsHierarchically(data || []);
      setDebateArguments(argumentsWithChildren);
    } catch (error: any) {
      console.error('Error fetching arguments:', error);
      toast({
        title: "Fehler beim Laden der Argumente",
        description: "Die Argumente konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOptimizedArgument = async (
    argumentText: string,
    argumentTyp: 'These' | 'Pro' | 'Contra',
    parentId?: string,
    autorName?: string
  ) => {
    if (!user || !debateId) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um ein Argument zu erstellen.",
        variant: "destructive"
      });
      return null;
    }

    // Client-side rate limiting check first
    if (!InputValidator.checkRateLimit(user.id, 'create_argument', 3, 60000)) {
      toast({
        title: "Zu viele Anfragen",
        description: "Bitte warten Sie eine Minute, bevor Sie ein neues Argument erstellen.",
        variant: "destructive"
      });
      return null;
    }

    // Validate and sanitize input
    const argumentValidation = InputValidator.validateAndSanitizeArgument(argumentText);
    if (!argumentValidation.isValid) {
      toast({
        title: "Ungültiges Argument",
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
        throw new Error('Argument konnte nicht validiert werden');
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
        title: "Argument hinzugefügt",
        description: "Das neue Argument wurde erfolgreich erstellt."
      });

      return data;
    } catch (error: any) {
      console.error('Error creating argument:', error);
      toast({
        title: "Fehler beim Erstellen des Arguments",
        description: "Das Argument konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
      return null;
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchArguments();
  }, [debateId]);

  useEffect(() => {
    if (!debateId) return;

    let channel: any = null;

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
  }, [debateId]);

  return {
    arguments: debateArguments,
    loading,
    creating,
    fetchArguments,
    createArgument: createOptimizedArgument
  };
};
