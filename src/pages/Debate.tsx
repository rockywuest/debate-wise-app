
import React from 'react';
import { useDebates } from '@/hooks/useDebates';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { MessageSquare, Clock, Users } from 'lucide-react';

const Debate = () => {
  const { user } = useAuth();
  const { debates, loading: debatesLoading } = useDebates();

  if (debatesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Debatten werden geladen...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
              Debatten
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Bitte melden Sie sich an, um an Debatten teilzunehmen.
            </p>
            <Link to="/auth">
              <Button className="fw-button-gradient">
                Jetzt anmelden
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
            Alle Debatten
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Wählen Sie eine Debatte aus oder erstellen Sie eine neue
          </p>
          <CreateDebateForm />
        </div>

        <div className="max-w-4xl mx-auto">
          {debates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Noch keine Debatten</h3>
                <p className="text-muted-foreground">
                  Erstellen Sie die erste Debatte und beginnen Sie die Diskussion!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {debates.map((debate) => (
                <Card key={debate.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{debate.titel}</CardTitle>
                        {debate.beschreibung && (
                          <CardDescription className="text-base">
                            {debate.beschreibung}
                          </CardDescription>
                        )}
                      </div>
                      <Link to={`/debate/${debate.id}`}>
                        <Button className="fw-button-gradient ml-4">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Teilnehmen
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Erstellt am {new Date(debate.erstellt_am).toLocaleDateString('de-DE')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        ID: {debate.id.substring(0, 8)}...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Debate;
