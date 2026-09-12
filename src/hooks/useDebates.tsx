
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

// Laedt die Debatten, ohne React-State anzufassen. Dadurch kann der Effect das
// Ergebnis erst NACH dem await in den State schreiben — ein synchrones setState
// im Effect-Rumpf loest sonst eine Renderkaskade aus
// (react-hooks/set-state-in-effect).
const loadDebates = async (): Promise<Debate[]> => {
  const { data, error } = await supabase
    .from('debatten')
    .select('*')
    .order('erstellt_am', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const useDebates = () => {
  // loaded und debates liegen zusammen im State, damit sich loading ableiten
  // laesst statt es als eigenes Flag im Effect synchron setzen zu muessen.
  const [state, setState] = useState<{ loaded: boolean; debates: Debate[] }>({
    loaded: false,
    debates: [],
  });
  const debates = state.debates;
  const loading = !state.loaded;
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

  const reportLoadFailure = useCallback(
    (error: unknown) => {
      console.error('Error fetching debates:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Laden der Debatten' : 'Failed to load debates',
        description: getErrorMessage(error),
        variant: "destructive"
      });
    },
    [getErrorMessage, language, toast]
  );

  // Manuelles Neuladen aus Event-Handlern (z.B. nach createDebate). setState ist
  // hier unbedenklich, weil der Aufruf nicht aus einem Effect kommt.
  const fetchDebates = useCallback(async () => {
    setState(prev => ({ ...prev, loaded: false }));
    try {
      setState({ loaded: true, debates: await loadDebates() });
    } catch (error: unknown) {
      reportLoadFailure(error);
      setState(prev => ({ ...prev, loaded: true }));
    }
  }, [reportLoadFailure]);

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
    let cancelled = false;
    (async () => {
      try {
        const loadedDebates = await loadDebates();
        if (!cancelled) setState({ loaded: true, debates: loadedDebates });
      } catch (error: unknown) {
        if (cancelled) return;
        reportLoadFailure(error);
        setState(prev => ({ ...prev, loaded: true }));
      }
    })();
    // Unmount waehrend eines laufenden Abrufs darf weder State schreiben noch
    // einen Toast ausloesen.
    return () => {
      cancelled = true;
    };
  }, [reportLoadFailure]);

  return {
    debates,
    loading,
    fetchDebates,
    createDebate
  };
};
