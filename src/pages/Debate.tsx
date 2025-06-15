
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { DebateCard } from '@/components/DebateCard';
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
  const { t, language } = useTranslation();

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
                <DebateCard
                  key={debate.id}
                  id={debate.id}
                  title={debate.titel}
                  description={debate.beschreibung}
                  createdAt={debate.erstellt_am}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Debate;
