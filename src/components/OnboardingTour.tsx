
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Award, Target, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingTour = ({ isOpen, onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: t('onboarding.step1.title'),
      description: t('onboarding.step1.desc'),
      demo: (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Relevance</span>
                <Badge className="bg-green-100 text-green-800">4/5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Evidence</span>
                <Badge className="bg-green-100 text-green-800">Present</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Specificity</span>
                <Badge className="bg-yellow-100 text-yellow-800">Concrete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Logic</span>
                <Badge className="bg-green-100 text-green-800">No Fallacy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: t('onboarding.step2.title'),
      description: t('onboarding.step2.desc'),
      demo: (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">High-quality argument</span>
                <Badge className="bg-green-100 text-green-800">+10 points</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Source provided</span>
                <Badge className="bg-green-100 text-green-800">+10 points</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Steel-manning</span>
                <Badge className="bg-green-100 text-green-800">+25 points</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Intellectual honesty</span>
                <Badge className="bg-green-100 text-green-800">+50 points</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: t('onboarding.step3.title'),
      description: t('onboarding.step3.desc'),
      demo: (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-800">Original:</p>
              <p className="text-xs italic">"Climate policies hurt the economy"</p>
              <p className="text-sm font-medium text-orange-800 mt-3">Steel-manning:</p>
              <p className="text-xs italic">"While climate action requires upfront investment, critics legitimately worry about short-term economic disruption for workers in traditional industries..."</p>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {steps[currentStep].icon}
            {t('onboarding.welcome')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            {t('onboarding.intro')}
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
            {steps[currentStep].demo}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                {t('onboarding.skip')}
              </Button>
              <Button onClick={handleNext} className="gap-2">
                {currentStep < steps.length - 1 ? (
                  <>
                    {t('common.next')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  t('onboarding.start')
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
