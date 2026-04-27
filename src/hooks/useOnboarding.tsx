
import { useState } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('debatewise-onboarding-completed'),
  );

  const completeOnboarding = () => {
    localStorage.setItem('debatewise-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('debatewise-onboarding-completed');
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding
  };
};
