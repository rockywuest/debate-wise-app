
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('debatewise-onboarding-completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

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
