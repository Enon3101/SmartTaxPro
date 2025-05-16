import { useEffect } from 'react';
import { useLocation } from 'wouter';

// This component will scroll the window to the top whenever the location changes
export function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Using 'auto' instead of 'smooth' for immediate effect
    });
    
    // Alternative method to ensure scrolling works in all browsers
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, [location]);
  
  return null; // This component doesn't render anything
}