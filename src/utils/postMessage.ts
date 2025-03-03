
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
    try {
      window.parent.postMessage(
        {
          type: 'ROUTE_CHANGE',
          url: currentUrl,
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
