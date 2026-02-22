
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';

export const PromoteUserForm = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePromoteToAdmin = async () => {
    if (!userId.trim()) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie eine gültige Benutzer-ID ein.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId.trim(),
          role: 'admin'
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Erfolgreich',
        description: 'Benutzer wurde zum Admin befördert.',
      });
      setUserId('');
    } catch (error: unknown) {
      const description = error instanceof Error
        ? error.message
        : 'Fehler beim Befördern des Benutzers.';
      console.error('Error promoting user:', error);
      toast({
        title: 'Fehler',
        description,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Benutzer zu Admin befördern
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Benutzer-ID:</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="UUID des Benutzers eingeben..."
            className="mt-1"
          />
        </div>
        <Button 
          onClick={handlePromoteToAdmin}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Beförderung läuft...' : 'Zu Admin befördern'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Hinweis: Sie finden Benutzer-IDs in der Supabase Auth Users Tabelle.
        </p>
      </CardContent>
    </Card>
  );
};
