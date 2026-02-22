
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { createDemoContent } from '@/utils/createDemoContent';
import { useTranslation } from '@/utils/i18n';
import { PromoteUserForm } from './PromoteUserForm';
import { 
  Settings, 
  Database, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Sparkles,
  Shield,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const handleSeedContent = async () => {
    setLoading(true);
    try {
      const success = await createDemoContent();
      if (success) {
        toast({
          title: text('Platform content created!', 'Plattform-Inhalte erstellt!'),
          description: text(
            'The platform has been successfully populated with high-quality debates and arguments.',
            'Die Plattform wurde erfolgreich mit hochwertigen Debatten und Argumenten gefullt.'
          ),
        });
      } else {
        toast({
          title: text('Error', 'Fehler'),
          description: text('Failed to create platform content.', 'Plattform-Inhalte konnten nicht erstellt werden.'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating platform content:', error);
      toast({
        title: text('Error', 'Fehler'),
        description: text('An unexpected error occurred.', 'Ein unerwarteter Fehler ist aufgetreten.'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">
          {text('Admin Dashboard', 'Admin Dashboard')}
        </h1>
        <Badge variant="destructive" className="ml-auto">
          {text('Admin only', 'Nur Admin')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="md:col-span-2 lg:col-span-1">
          <PromoteUserForm />
        </div>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {text('Content management', 'Inhalte verwalten')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {text('Manage platform content and add high-quality demo debates.', 'Verwalten Sie die Plattform-Inhalte und fugen Sie hochwertige Demo-Debatten hinzu.')}
            </p>
            <Button 
              onClick={handleSeedContent}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading 
                ? text('Creating content...', 'Erstelle Inhalte...')
                : text('Add demo content', 'Demo-Inhalte hinzufugen')
              }
            </Button>
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {text('Platform analytics', 'Plattform-Statistiken')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {text('Monitor engagement metrics and platform performance.', 'Engagement-Metriken und Plattform-Performance uberwachen.')}
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {text('Coming soon', 'Bald verfugbar')}
            </Button>
          </CardContent>
        </Card>

        {/* Debate Moderation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {text('Debate moderation', 'Debatten moderieren')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {text('Review and moderate debates while ensuring quality standards.', 'Debatten uberprufen, moderieren und die Qualitat sicherstellen.')}
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {text('Coming soon', 'Bald verfugbar')}
            </Button>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {text('Platform settings', 'Plattform-Einstellungen')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {text('General platform configuration and settings.', 'Allgemeine Plattform-Konfiguration und -Einstellungen.')}
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {text('Coming soon', 'Bald verfugbar')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">
            {text('Admin notes', 'Admin-Hinweise')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm">
              {text(
                'Demo content: creates high-quality debates with realistic user profiles, arguments, and engagement metrics.',
                'Demo-Inhalte: erstellt hochwertige Debatten mit realistischen Benutzerprofilen, Argumenten und Engagement-Metriken.'
              )}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm">
              {text(
                'Promote users: use the form above to grant admin rights. You can find user IDs in the Supabase Auth Users table.',
                'Benutzer befordern: verwenden Sie das Formular oben, um Admin-Rechte zu vergeben. Benutzer-IDs finden Sie in der Supabase Auth Users Tabelle.'
              )}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm">
              {text(
                'These features are only available to platform administrators. Access is protected by role-based controls.',
                'Diese Funktionen sind nur fur Plattform-Administratoren verfugbar. Der Zugriff ist durch rollenbasierte Kontrollen geschutzt.'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
