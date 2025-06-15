
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Brain, Target, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const MandatoryOnboarding = () => {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: "Willkommen zum intelligenten Diskurs",
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-center text-lg">
            Dies ist keine gewöhnliche Diskussionsplattform. Hier zählt die <strong>Qualität</strong> Ihrer Argumente, nicht deren Popularität.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Unsere Mission:</h4>
            <p className="text-sm">Den vergifteten Online-Diskurs heilen durch intelligente, evidenzbasierte Argumentation und intellektuelle Ehrlichkeit.</p>
          </div>
        </div>
      )
    },
    {
      title: "KI-gestützte Argumentanalyse",
      icon: <Target className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p>Jedes Argument wird automatisch auf vier Dimensionen analysiert:</p>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-blue-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">Relevanz</h5>
                <p className="text-xs">Bezieht sich auf das Thema</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">Substantiierung</h5>
                <p className="text-xs">Mit Beweisen untermauert</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">Spezifität</h5>
                <p className="text-xs">Konkret statt vage</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm">Logik</h5>
                <p className="text-xs">Frei von Fehlschlüssen</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Reputationssystem für intellektuelle Tugenden",
      icon: <Award className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p>Reputation wird durch <strong>intellektuelle Ehrlichkeit</strong> verdient, nicht durch Popularität:</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">🤝 Einen Punkt zugestehen</span>
              <Badge className="bg-green-100 text-green-800">+50 Punkte</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">⚖️ Gegenargument fair darstellen</span>
              <Badge className="bg-blue-100 text-blue-800">+30 Punkte</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm">🎯 Hochwertiges Argument</span>
              <Badge className="bg-yellow-100 text-yellow-800">+20 Punkte</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-sm">📚 Quellen bereitstellen</span>
              <Badge className="bg-orange-100 text-orange-800">+10 Punkte</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Diskursregeln für konstruktive Debatten",
      icon: <Users className="h-8 w-8 text-red-600" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm">Steel-Manning</h5>
                <p className="text-xs text-muted-foreground">Stellen Sie Gegenargumente in ihrer stärksten Form dar, bevor Sie sie widerlegen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm">Evidenzbasiert</h5>
                <p className="text-xs text-muted-foreground">Unterstützen Sie Behauptungen mit Quellen, Daten oder konkreten Beispielen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm">Konzessionsbereitschaft</h5>
                <p className="text-xs text-muted-foreground">Gestehen Sie zu, wenn ein Argument Sie überzeugt - das ist eine Stärke</p>
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
                Zurück
              </Button>
            )}
            <Button onClick={handleNext} className="gap-2">
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Verstanden - Los geht's!
                </>
              ) : (
                <>
                  Weiter
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
