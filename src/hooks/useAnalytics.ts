import { useCallback } from 'react';

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface NavigationEvent {
  from: string;
  to: string;
  method: 'click' | 'keyboard' | 'programmatic';
  component: 'desktop' | 'mobile' | 'dropdown';
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    // Initialize analytics - in production, this would connect to a real analytics service
    this.isEnabled = process.env.NODE_ENV === 'production' || process.env.VITE_ANALYTICS_ENABLED === 'true';
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);

    // In production, you would send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', event, properties);
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }
  }

  trackNavigation(navigationEvent: NavigationEvent) {
    this.track('navigation', {
      from_page: navigationEvent.from,
      to_page: navigationEvent.to,
      interaction_method: navigationEvent.method,
      component_type: navigationEvent.component,
      timestamp: navigationEvent.timestamp
    });
  }

  trackDropdownInteraction(action: 'open' | 'close', method: 'click' | 'keyboard' | 'outside_click') {
    this.track('dropdown_interaction', {
      action,
      method,
      component: 'solutions_dropdown'
    });
  }

  trackMobileMenuInteraction(action: 'open' | 'close', method: 'click' | 'keyboard' | 'outside_click') {
    this.track('mobile_menu_interaction', {
      action,
      method,
      component: 'mobile_menu'
    });
  }

  trackSearchBehavior(query: string, resultsCount: number, responseTime: number) {
    this.track('search_performed', {
      query_length: query.length,
      results_count: resultsCount,
      response_time: responseTime,
      has_results: resultsCount > 0
    });
  }

  trackUserEngagement(action: string, element: string, additionalData?: Record<string, any>) {
    this.track('user_engagement', {
      action,
      element,
      ...additionalData
    });
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

const analytics = new Analytics();

export const useAnalytics = () => {
  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  }, []);

  const trackNavigation = useCallback((navigationEvent: NavigationEvent) => {
    analytics.trackNavigation(navigationEvent);
  }, []);

  const trackDropdownInteraction = useCallback((action: 'open' | 'close', method: 'click' | 'keyboard' | 'outside_click') => {
    analytics.trackDropdownInteraction(action, method);
  }, []);

  const trackMobileMenuInteraction = useCallback((action: 'open' | 'close', method: 'click' | 'keyboard' | 'outside_click') => {
    analytics.trackMobileMenuInteraction(action, method);
  }, []);

  const trackSearchBehavior = useCallback((query: string, resultsCount: number, responseTime: number) => {
    analytics.trackSearchBehavior(query, resultsCount, responseTime);
  }, []);

  const trackUserEngagement = useCallback((action: string, element: string, additionalData?: Record<string, any>) => {
    analytics.trackUserEngagement(action, element, additionalData);
  }, []);

  return {
    trackEvent,
    trackNavigation,
    trackDropdownInteraction,
    trackMobileMenuInteraction,
    trackSearchBehavior,
    trackUserEngagement,
    analytics
  };
};

export default analytics;