import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  sessionId: string;
}

class PerformanceMonitor {
  private sessionId: string;
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = !import.meta.env.DEV; // Only track in production
    
    if (this.isEnabled) {
      this.initWebVitals();
      this.initCustomMetrics();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initWebVitals() {
    const handleMetric = (metric: Metric) => {
      this.trackMetric({
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        timestamp: Date.now(),
        url: window.location.pathname,
        sessionId: this.sessionId,
      });
    };

    // Core Web Vitals
    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }

  private initCustomMetrics() {
    // Track route changes
    this.trackRouteChanges();
    
    // Track long tasks
    this.trackLongTasks();
    
    // Track memory usage
    this.trackMemoryUsage();
    
    // Track bundle loading times
    this.trackBundleLoading();
  }

  private trackRouteChanges() {
    let startTime = performance.now();
    
    const observer = new MutationObserver(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 16) { // More than one frame
        this.trackMetric({
          name: 'route-change',
          value: Math.round(duration),
          rating: duration < 100 ? 'good' : duration < 300 ? 'needs-improvement' : 'poor',
          timestamp: Date.now(),
          url: window.location.pathname,
          sessionId: this.sessionId,
        });
      }
      
      startTime = performance.now();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private trackLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            this.trackMetric({
              name: 'long-task',
              value: Math.round(entry.duration),
              rating: 'poor',
              timestamp: Date.now(),
              url: window.location.pathname,
              sessionId: this.sessionId,
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemoryMB = memory.usedJSHeapSize / 1024 / 1024;
        
        if (usedMemoryMB > 50) { // Alert if using more than 50MB
          this.trackMetric({
            name: 'memory-usage',
            value: Math.round(usedMemoryMB),
            rating: usedMemoryMB < 100 ? 'good' : usedMemoryMB < 200 ? 'needs-improvement' : 'poor',
            timestamp: Date.now(),
            url: window.location.pathname,
            sessionId: this.sessionId,
          });
        }
      }, 10000); // Check every 10 seconds
    }
  }

  private trackBundleLoading() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            this.trackMetric({
              name: 'bundle-load',
              value: Math.round(entry.duration),
              rating: entry.duration < 500 ? 'good' : entry.duration < 1000 ? 'needs-improvement' : 'poor',
              timestamp: Date.now(),
              url: window.location.pathname,
              sessionId: this.sessionId,
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private trackMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Send to server periodically
    if (this.metrics.length >= 10) {
      this.sendMetrics();
    }
    
    // Log poor performance in development
    if (import.meta.env.DEV && metric.rating === 'poor') {
      console.warn('Poor performance detected:', metric);
    }
  }

  private async sendMetrics() {
    if (this.metrics.length === 0) return;
    
    const metricsToSend = [...this.metrics];
    this.metrics = [];
    
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics: metricsToSend }),
      });
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
      // Re-add metrics to queue for retry
      this.metrics.unshift(...metricsToSend);
    }
  }

  // Public methods
  public trackCustomMetric(name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor') {
    this.trackMetric({
      name,
      value,
      rating: rating || (value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor'),
      timestamp: Date.now(),
      url: window.location.pathname,
      sessionId: this.sessionId,
    });
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public sendMetricsNow() {
    this.sendMetrics();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  return {
    trackCustomMetric: performanceMonitor.trackCustomMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    sendMetrics: performanceMonitor.sendMetricsNow.bind(performanceMonitor),
  };
} 