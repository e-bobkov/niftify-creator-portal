
/**
 * Utility for sending postMessage to parent window when in an iframe
 */

// Check if the current window is inside an iframe
export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to same-origin policy,
    // then we're definitely in an iframe
    return true;
  }
};

// List of allowed parent origins
const ALLOWED_ORIGINS = [
  'https://test.ftsoa.art',
  'http://test.ftsoa.art',
  'https://ftsoa.art',
  'http://ftsoa.art',
  // Add localhost or other development domains if needed
  'http://localhost:3000',
  'http://localhost:8080',
];

// Send the current URL to the parent window
export const sendCurrentUrlToParent = (): void => {
  if (isInIframe()) {
    const currentUrl = window.location.href;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    try {
      // First try with specific origin
      ALLOWED_ORIGINS.forEach(origin => {
        try {
          window.parent.postMessage(
            {
              type: 'ROUTE_CHANGE',
              url: currentUrl,
              pathname,
              search,
              hash,
              title: document.title,
              timestamp: Date.now()
            },
            origin
          );
        } catch (e) {
          // Silently fail for specific origins that don't work
        }
      });
      
      // Also send with wildcard for compatibility
      window.parent.postMessage(
        {
          type: 'ROUTE_CHANGE',
          url: currentUrl,
          pathname,
          search,
          hash,
          title: document.title,
          timestamp: Date.now()
        },
        '*'
      );
      
      console.log('Sent postMessage with current URL:', currentUrl);
    } catch (error) {
      console.error('Failed to send postMessage:', error);
    }
  }
};

/**
 * Manually trigger sending the current URL to the parent
 * This can be called from anywhere in the application
 */
export const triggerSendUrlToParent = (): void => {
  sendCurrentUrlToParent();
};

// Add a message listener for two-way communication
export const setupMessageListener = (): void => {
  if (isInIframe()) {
    window.addEventListener('message', (event) => {
      // Check if origin is allowed
      if (ALLOWED_ORIGINS.includes(event.origin)) {
        // Handle messages from parent
        if (event.data && event.data.type === 'REQUEST_CURRENT_URL') {
          sendCurrentUrlToParent();
          console.log('Responding to parent request for URL');
        }
      }
    });
    
    console.log('PostMessage listener initialized');
  }
};
