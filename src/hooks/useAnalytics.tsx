import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, unknown>;
  page_url?: string;
  user_agent?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Don't track events for unauthenticated users in demo
      if (!user) return;

      const eventData = {
        event_type: event.event_type,
        user_id: user.id,
        event_data: event.event_data || {},
        page_url: event.page_url || window.location.pathname,
        user_agent: event.user_agent || navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Log to console for development
      console.log('Analytics Event:', eventData);

      // In a real implementation, you would send this to your analytics service
      // For now, we'll just store in a simple format
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      existingEvents.push(eventData);
      
      // Keep only last 100 events in localStorage
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(existingEvents));

    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [user]);

  const trackPageView = useCallback((page: string) => {
    trackEvent({
      event_type: 'page_view',
      event_data: { page },
      page_url: window.location.pathname
    });
  }, [trackEvent]);

  const trackInteraction = useCallback((interaction: string, data?: Record<string, unknown>) => {
    trackEvent({
      event_type: 'user_interaction',
      event_data: { interaction, ...data }
    });
  }, [trackEvent]);

  const trackArgumentQuality = useCallback((argumentId: string, qualityScore: number) => {
    trackEvent({
      event_type: 'argument_quality_analysis',
      event_data: { 
        argument_id: argumentId, 
        quality_score: qualityScore,
        quality_category: qualityScore >= 80 ? 'excellent' : qualityScore >= 60 ? 'good' : 'needs_improvement'
      }
    });
  }, [trackEvent]);

  const getAnalyticsData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackInteraction,
    trackArgumentQuality,
    getAnalyticsData
  };
};
