import { useEffect } from 'react';
import { useLocation } from 'wouter';

// This component will scroll the window to the top whenever the location changes
export function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    const doScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
      // Fallbacks
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    // Delay scroll until the next animation frame,
    // allowing the browser a bit more time to render the new page layout.
    const frameId = requestAnimationFrame(doScroll);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [location]);
  
  return null; // This component doesn't render anything
}
