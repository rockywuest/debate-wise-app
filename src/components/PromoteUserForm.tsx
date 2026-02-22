
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

export const PromoteUserForm = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const handlePromoteToAdmin = async () => {
    if (!userId.trim()) {
      toast({
        title: text('Error', 'Fehler'),
        description: text('Please enter a valid user ID.', 'Bitte geben Sie eine gultige Benutzer-ID ein.'),
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
        title: text('Success', 'Erfolgreich'),
        description: text('User promoted to admin.', 'Benutzer wurde zum Admin befordert.'),
      });
      setUserId('');
    } catch (error: unknown) {
      const description = error instanceof Error
        ? error.message
        : text('Failed to promote user.', 'Fehler beim Befordern des Benutzers.');
      console.error('Error promoting user:', error);
      toast({
        title: text('Error', 'Fehler'),
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
          {text('Promote user to admin', 'Benutzer zu Admin befordern')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">{text('User ID:', 'Benutzer-ID:')}</label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={text('Enter user UUID...', 'UUID des Benutzers eingeben...')}
            className="mt-1"
          />
        </div>
        <Button 
          onClick={handlePromoteToAdmin}
          disabled={loading}
          className="w-full"
        >
          {loading ? text('Promoting...', 'Beforderung lauft...') : text('Promote to admin', 'Zu Admin befordern')}
        </Button>
        <p className="text-xs text-muted-foreground">
          {text('Note: You can find user IDs in the Supabase Auth Users table.', 'Hinweis: Sie finden Benutzer-IDs in der Supabase Auth Users Tabelle.')}
        </p>
      </CardContent>
    </Card>
  );
};
