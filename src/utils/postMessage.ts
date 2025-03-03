
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

// Send the current URL to the parent window
export const sendCurrentUrlToParent = (): void => {
  if (isInIframe()) {
    const currentUrl = window.location.href;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
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
        '*' // Consider restricting this to specific origins in production
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
