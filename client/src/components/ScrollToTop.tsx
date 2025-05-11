import { useEffect } from 'react';
import { useLocation } from 'wouter';

// This component will scroll the window to the top whenever the location changes
export function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [location]);
  
  return null; // This component doesn't render anything
}