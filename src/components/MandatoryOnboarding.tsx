
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTranslation } from '@/utils/i18n';
import { Brain, Target, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const MandatoryOnboarding = () => {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { language } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const onboardingSteps = [
    {
      title: text('Welcome to intelligent discourse', 'Willkommen zum intelligenten Diskurs'),
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-center text-lg">
            {text(
              'This is not a typical discussion platform. Here, the ',
              'Dies ist keine gewohnliche Diskussionsplattform. Hier zahlt die '
            )}
            <strong>{text('quality', 'Qualitat')}</strong>
            {text(
              ' of your arguments matters, not their popularity.',
              ' Ihrer Argumente, nicht deren Popularitat.'
            )}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{text('Our mission:', 'Unsere Mission:')}</h4>
            <p className="text-sm">
              {text(
                'Improve online discourse through intelligent, evidence-based argumentation and intellectual honesty.',
                'Den vergifteten Online-Diskurs heilen durch intelligente, evidenzbasierte Argumentation und intellektuelle Ehrlichkeit.'
              )}
            </p>
          </div>
        </div>
      )
    },
    {
      title: text('AI-powered argument analysis', 'KI-gestutzte Argumentanalyse'),
      icon: <Target className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p>{text('Every argument is automatically analyzed across four dimensions:', 'Jedes Argument wird automatisch auf vier Dimensionen analysiert:')}</p>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-blue-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">{text('Relevance', 'Relevanz')}</h5>
                <p className="text-xs">{text('Addresses the topic directly', 'Bezieht sich auf das Thema')}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">{text('Evidence', 'Substantiierung')}</h5>
                <p className="text-xs">{text('Backed by examples or proof', 'Mit Beweisen untermauert')}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">{text('Specificity', 'Spezifitat')}</h5>
                <p className="text-xs">{text('Concrete instead of vague', 'Konkret statt vage')}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">{text('Logic', 'Logik')}</h5>
                <p className="text-xs">{text('Free of fallacies', 'Frei von Fehlschlussen')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: text('Reputation for intellectual virtues', 'Reputationssystem fur intellektuelle Tugenden'),
      icon: <Award className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p>
            {text('Reputation is earned through ', 'Reputation wird durch ')}
            <strong>{text('intellectual honesty', 'intellektuelle Ehrlichkeit')}</strong>
            {text(', not popularity:', ', nicht durch Popularitat:')}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">{text('🤝 Concede a point', '🤝 Einen Punkt zugestehen')}</span>
              <Badge className="bg-green-100 text-green-800">{text('+50 points', '+50 Punkte')}</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">{text('⚖️ Fairly represent a counterargument', '⚖️ Gegenargument fair darstellen')}</span>
              <Badge className="bg-blue-100 text-blue-800">{text('+30 points', '+30 Punkte')}</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm">{text('🎯 High-quality argument', '🎯 Hochwertiges Argument')}</span>
              <Badge className="bg-yellow-100 text-yellow-800">{text('+20 points', '+20 Punkte')}</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-sm">{text('📚 Provide sources', '📚 Quellen bereitstellen')}</span>
              <Badge className="bg-orange-100 text-orange-800">{text('+10 points', '+10 Punkte')}</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: text('Rules for constructive debate', 'Diskursregeln fur konstruktive Debatten'),
      icon: <Users className="h-8 w-8 text-red-600" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm">Steel-Manning</h5>
                <p className="text-xs text-muted-foreground">
                  {text(
                    'Represent counterarguments in their strongest form before refuting them.',
                    'Stellen Sie Gegenargumente in ihrer starksten Form dar, bevor Sie sie widerlegen.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm">{text('Evidence-based', 'Evidenzbasiert')}</h5>
                <p className="text-xs text-muted-foreground">
                  {text(
                    'Support claims with sources, data, or concrete examples.',
                    'Unterstutzen Sie Behauptungen mit Quellen, Daten oder konkreten Beispielen.'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm">{text('Willingness to concede', 'Konzessionsbereitschaft')}</h5>
                <p className="text-xs text-muted-foreground">
                  {text(
                    'Acknowledge when an argument convinced you. That is a strength.',
                    'Gestehen Sie zu, wenn ein Argument Sie uberzeugt. Das ist eine Starke.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!showOnboarding) return null;

  const currentStepData = onboardingSteps[currentStep];

  return (
    <Dialog open={showOnboarding} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {currentStepData.icon}
            <span>{currentStepData.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {currentStepData.content}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                {text('Back', 'Zuruck')}
              </Button>
            )}
            <Button onClick={handleNext} className="gap-2">
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {text("Got it - let's begin!", "Verstanden - Los geht's!")}
                </>
              ) : (
                <>
                  {text('Next', 'Weiter')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
