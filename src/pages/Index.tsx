
import { useAuth } from '@/hooks/useAuth';
import { useDebates } from '@/hooks/useDebates';
import { Button } from '@/components/ui/button';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { debates, loading: debatesLoading } = useDebates();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-6">
            Willkommen zum Debattensystem
          </h1>
          
          {user ? (
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground">
                Hallo! Sie sind erfolgreich angemeldet.
              </p>
              <div className="flex gap-4 justify-center">
                <CreateDebateForm />
                {debates.length > 0 && (
                  <Link to="/debate">
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Zu den Debatten
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground">
                Strukturierte Diskussionen mit visuellen Argumentkarten
              </p>
              <div>
                <Link to="/auth">
                  <Button size="lg">
                    Jetzt starten
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Aktuelle Debatten</h2>
            {debatesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Debatten werden geladen...</p>
              </div>
            ) : debates.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Noch keine Debatten vorhanden. Erstellen Sie die erste Debatte!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {debates.map((debate) => (
                  <Card key={debate.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{debate.titel}</CardTitle>
                          {debate.beschreibung && (
                            <CardDescription className="mt-2">
                              {debate.beschreibung}
                            </CardDescription>
                          )}
                        </div>
                        <Link to="/debate">
                          <Button variant="outline" size="sm">
                            Teilnehmen
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(debate.erstellt_am).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
