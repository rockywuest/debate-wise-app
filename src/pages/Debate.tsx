
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { OnboardingTour } from '@/components/OnboardingTour';
import { useDebates } from '@/hooks/useDebates';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTranslation } from '@/utils/i18n';
import { MessageSquare, Users, Clock, TrendingUp } from 'lucide-react';

const Debate = () => {
  const { debates, loading } = useDebates();
  const { user } = useAuth();
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
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
              debate wise
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {t('debates.subtitle')}
            </p>
            <Link to="/auth">
              <Button className="fw-button-gradient">
                {t('nav.login')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour 
        isOpen={showOnboarding} 
        onComplete={completeOnboarding}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
            {t('debates.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {t('debates.subtitle')}
          </p>
          <div className="bg-fw-panel rounded-xl p-6 shadow-card">
            <CreateDebateForm />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!debates || debates.length === 0 ? (
            <Card className="fw-card text-center py-12">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">
                  {t('debates.empty')}
                </p>
                <CreateDebateForm />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {debates.map((debate) => (
                <Card key={debate.id} className="fw-card hover:shadow-lg transition-shadow">
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
                      <Badge variant="secondary" className="ml-4">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(debate.erstellt_am).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Growing</span>
                        </div>
                      </div>
                      <Link to={`/debate/${debate.id}`}>
                        <Button className="fw-button-gradient">
                          {t('nav.debates')}
                        </Button>
                      </Link>
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
