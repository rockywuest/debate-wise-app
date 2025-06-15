
import { useAuth } from '@/hooks/useAuth';
import { useDebates } from '@/hooks/useDebates';
import { Button } from '@/components/ui/button';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock, Trophy } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { debates, loading: debatesLoading } = useDebates();
  const { t, language } = useTranslation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-6">
            {t('index.welcome')}
          </h1>
          
          {user ? (
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground">
                {t('index.hello')}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <CreateDebateForm />
                <Link to="/debates">
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('index.viewAllDebates')}
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    {t('index.viewLeaderboard')}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground">
                {t('index.structuredDiscussion')}
              </p>
              <div>
                <Link to="/auth">
                  <Button size="lg">
                    {t('index.getStarted')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('index.latestDebates')}</h2>
              <Link to="/debates">
                <Button variant="outline" size="sm">
                  {t('index.viewAll')}
                </Button>
              </Link>
            </div>
            {debatesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">{t('index.debatesLoading')}</p>
              </div>
            ) : debates.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('index.noDebatesYet')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {debates.slice(0, 3).map((debate) => (
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
                        <Link to={`/debate/${debate.id}`}>
                          <Button variant="outline" size="sm">
                            {t('index.participate')}
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(debate.erstellt_am).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
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
