
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Argument {
  id: string;
  debatten_id: string;
  eltern_id?: string;
  argument_text: string;
  argument_typ: 'These' | 'Pro' | 'Contra';
  benutzer_id: string;
  autor_name?: string;
  erstellt_am: string;
  aktualisiert_am: string;
  childArguments?: Argument[];
}

export const useArguments = (debateId?: string) => {
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchArguments = async () => {
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

      // Organisiere Argumente hierarchisch
      const topLevelArgs = (data || []).filter(arg => !arg.eltern_id);
      const childArgs = (data || []).filter(arg => arg.eltern_id);

      const argumentsWithChildren = topLevelArgs.map(parent => ({
        ...parent,
        childArguments: childArgs.filter(child => child.eltern_id === parent.id)
      }));

      setDebateArguments(argumentsWithChildren);
    } catch (error: any) {
      console.error('Error fetching arguments:', error);
      toast({
        title: "Fehler beim Laden der Argumente",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createArgument = async (
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
        title: "Argument hinzugefügt",
        description: "Das neue Argument wurde erfolgreich erstellt."
      });

      await fetchArguments();
      return data;
    } catch (error: any) {
      console.error('Error creating argument:', error);
      toast({
        title: "Fehler beim Erstellen des Arguments",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchArguments();
  }, [debateId]);

  return {
    arguments: debateArguments,
    loading,
    fetchArguments,
    createArgument
  };
};
