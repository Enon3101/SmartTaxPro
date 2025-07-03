// Google Analytics 4 utility
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track Web Vitals
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        event({
          action: 'web_vitals',
          category: 'performance',
          label: 'CLS',
          value: Math.round(metric.value * 1000)
        });
      });
      
      getFID((metric) => {
        event({
          action: 'web_vitals',
          category: 'performance',
          label: 'FID',
          value: Math.round(metric.value)
        });
      });
      
      getFCP((metric) => {
        event({
          action: 'web_vitals',
          category: 'performance',
          label: 'FCP',
          value: Math.round(metric.value)
        });
      });
      
      getLCP((metric) => {
        event({
          action: 'web_vitals',
          category: 'performance',
          label: 'LCP',
          value: Math.round(metric.value)
        });
      });
      
      getTTFB((metric) => {
        event({
          action: 'web_vitals',
          category: 'performance',
          label: 'TTFB',
          value: Math.round(metric.value)
        });
      });
    });
  }
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
