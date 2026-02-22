
import React, { useEffect } from 'react';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';

const Analytics = () => {
  const { trackPageView } = useAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    trackPageView('analytics');
  }, [trackPageView]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Please sign in to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 fw-gradient-text">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Einblicke in die Plattform-Performance und Nutzerverhalten
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default Analytics;
