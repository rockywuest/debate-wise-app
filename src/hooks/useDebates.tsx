
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/utils/i18n';

export interface Debate {
  id: string;
  titel: string;
  beschreibung?: string;
  erstellt_von: string;
  erstellt_am: string;
  aktualisiert_am: string;
}

export const useDebates = () => {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { language } = useTranslation();

  const getErrorMessage = useCallback(
    (error: unknown): string => {
      if (error instanceof Error) {
        return error.message;
      }
      return language === 'de' ? 'Ein unerwarteter Fehler ist aufgetreten.' : 'An unexpected error occurred.';
    },
    [language]
  );

  const fetchDebates = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debatten')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) throw error;
      setDebates(data || []);
    } catch (error: unknown) {
      console.error('Error fetching debates:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Laden der Debatten' : 'Failed to load debates',
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage, language, toast]);

  const createDebate = async (titel: string, beschreibung?: string) => {
    if (!user) {
      toast({
        title: language === 'de' ? 'Anmeldung erforderlich' : 'Sign-in required',
        description: language === 'de'
          ? 'Sie müssen angemeldet sein, um eine Debatte zu erstellen.'
          : 'You must be signed in to create a debate.',
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('debatten')
        .insert({
          titel,
          beschreibung,
          erstellt_von: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: language === 'de' ? 'Debatte erstellt' : 'Debate created',
        description: language === 'de'
          ? 'Die neue Debatte wurde erfolgreich erstellt.'
          : 'The new debate was created successfully.'
      });

      await fetchDebates();
      return data;
    } catch (error: unknown) {
      console.error('Error creating debate:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Erstellen der Debatte' : 'Failed to create debate',
        description: getErrorMessage(error),
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchDebates();
  }, [fetchDebates]);

  return {
    debates,
    loading,
    fetchDebates,
    createDebate
  };
};
