
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { createDemoContent } from '@/utils/createDemoContent';
import { useTranslation } from '@/utils/i18n';
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

  const handleSeedContent = async () => {
    setLoading(true);
    try {
      const success = await createDemoContent();
      if (success) {
        toast({
          title: language === 'de' ? 'Plattform-Inhalte erstellt!' : 'Platform content created!',
          description: language === 'de' 
            ? 'Die Plattform wurde erfolgreich mit hochwertigen Debatten und Argumenten gefüllt.' 
            : 'The platform has been successfully populated with high-quality debates and arguments.',
        });
      } else {
        toast({
          title: language === 'de' ? 'Fehler' : 'Error',
          description: language === 'de' 
            ? 'Plattform-Inhalte konnten nicht erstellt werden.' 
            : 'Failed to create platform content.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating platform content:', error);
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de' 
          ? 'Ein unerwarteter Fehler ist aufgetreten.' 
          : 'An unexpected error occurred.',
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
          {language === 'de' ? 'Admin Dashboard' : 'Admin Dashboard'}
        </h1>
        <Badge variant="destructive" className="ml-auto">
          {language === 'de' ? 'Nur Admin' : 'Admin Only'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {language === 'de' ? 'Inhalte verwalten' : 'Content Management'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Verwalten Sie die Plattform-Inhalte und fügen Sie hochwertige Demo-Debatten hinzu.'
                : 'Manage platform content and add high-quality demo debates.'
              }
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
                ? (language === 'de' ? 'Erstelle Inhalte...' : 'Creating content...') 
                : (language === 'de' ? 'Demo-Inhalte hinzufügen' : 'Add demo content')
              }
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {language === 'de' ? 'Benutzer verwalten' : 'User Management'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Benutzerkonten, Rollen und Reputationen verwalten.'
                : 'Manage user accounts, roles, and reputations.'
              }
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {language === 'de' ? 'Bald verfügbar' : 'Coming soon'}
            </Button>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {language === 'de' ? 'Plattform-Statistiken' : 'Platform Analytics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Engagement-Metriken und Plattform-Performance überwachen.'
                : 'Monitor engagement metrics and platform performance.'
              }
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {language === 'de' ? 'Bald verfügbar' : 'Coming soon'}
            </Button>
          </CardContent>
        </Card>

        {/* Debate Moderation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {language === 'de' ? 'Debatten moderieren' : 'Debate Moderation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Debatten überprüfen, moderieren und die Qualität sicherstellen.'
                : 'Review, moderate debates and ensure quality standards.'
              }
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {language === 'de' ? 'Bald verfügbar' : 'Coming soon'}
            </Button>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {language === 'de' ? 'Plattform-Einstellungen' : 'Platform Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Allgemeine Plattform-Konfiguration und -Einstellungen.'
                : 'General platform configuration and settings.'
              }
            </p>
            <Button variant="outline" className="w-full mt-4" disabled>
              {language === 'de' ? 'Bald verfügbar' : 'Coming soon'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'de' ? 'Admin-Hinweise' : 'Admin Notes'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm">
              {language === 'de' 
                ? '🎯 Demo-Inhalte hinzufügen: Erstellt hochwertige, professionelle Debatten mit realistischen Benutzerprofilen, Argumenten und Engagement-Metriken.'
                : '🎯 Add Demo Content: Creates high-quality, professional debates with realistic user profiles, arguments, and engagement metrics.'
              }
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm">
              {language === 'de' 
                ? '⚠️ Diese Funktionen sind nur für Plattform-Administratoren verfügbar. Der Zugriff sollte durch ein ordnungsgemäßes Rollensystem geschützt werden.'
                : '⚠️ These features are only available to platform administrators. Access should be protected by a proper role system.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
