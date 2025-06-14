
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

  const fetchDebates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debatten')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) throw error;
      setDebates(data || []);
    } catch (error: any) {
      console.error('Error fetching debates:', error);
      toast({
        title: "Fehler beim Laden der Debatten",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDebate = async (titel: string, beschreibung?: string) => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um eine Debatte zu erstellen.",
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
        title: "Debatte erstellt",
        description: "Die neue Debatte wurde erfolgreich erstellt."
      });

      await fetchDebates();
      return data;
    } catch (error: any) {
      console.error('Error creating debate:', error);
      toast({
        title: "Fehler beim Erstellen der Debatte",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchDebates();
  }, []);

  return {
    debates,
    loading,
    fetchDebates,
    createDebate
  };
};
