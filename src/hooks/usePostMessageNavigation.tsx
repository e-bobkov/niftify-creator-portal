
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendCurrentUrlToParent } from '@/utils/postMessage';

/**
 * A hook that sends the current URL to the parent window via postMessage
 * when the route changes, but only if the site is in an iframe
 */
export const usePostMessageNavigation = () => {
  const location = useLocation();
  
  // Send current URL on initial load
  useEffect(() => {
    // Use setTimeout to ensure this runs after the component is mounted
    const timer = setTimeout(() => {
      sendCurrentUrlToParent();
      console.log('Initial postMessage sent');
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Send current URL whenever the route changes
  useEffect(() => {
    sendCurrentUrlToParent();
    console.log('Route change postMessage sent:', location.pathname);
  }, [location]);
};
