import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { trackEvent } from './analytics';

const sendToAnalytics = (metric: any) => {
  trackEvent('web_vitals', 'performance', metric.name, Math.round(metric.value));
  
  // Send to your analytics service
  console.log('Web Vital:', metric);
};

export const initWebVitals = () => {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};
