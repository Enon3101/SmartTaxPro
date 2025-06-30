import { useEffect } from 'react';
import { trackWebVitals } from '../lib/analytics';

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Track Web Vitals
    trackWebVitals();
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      
      return () => observer.disconnect();
    }
  }, []);
}