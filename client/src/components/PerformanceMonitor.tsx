import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVital {
  name: string;
  value: number;
  delta: number;
  id: string;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    const sendToAnalytics = (metric: WebVital) => {
      // Only send in production
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Performance] ${metric.name}:`, metric.value, 'ms');
        return;
      }

      // Send to your analytics service
      if (window.gtag) {
        window.gtag('event', metric.name, {
          custom_map: { [metric.name]: 'performance_metric' },
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_delta: metric.delta,
        });
      }

      // You can also send to your own analytics API
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          delta: metric.delta,
          id: metric.id,
          timestamp: Date.now(),
          url: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silently fail analytics
      });
    };

    // Measure Core Web Vitals
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);

    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
        console.warn('[Performance] High memory usage detected:', memory);
      }
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn('[Performance] Long task detected:', entry);
            }
          });
        });
        observer.observe({ entryTypes: ['longtask'] });

        return () => observer.disconnect();
      } catch (error) {
        // Some browsers may not support longtask
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 