
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { CheckoutContainer } from "@/components/checkout/CheckoutContainer";
import { isInIframe } from "@/utils/postMessage";

const Checkout = () => {
  const navigate = useNavigate();

  // Set up listener for when payment completes in another tab
  useEffect(() => {
    // When payment window is opened, redirect to inventory after a delay
    const handlePaymentRedirect = (e: StorageEvent) => {
      if (e.key === 'payment_initiated' && e.newValue === 'true') {
        // Navigate to inventory after payment is initiated
        navigate('/inventory');
        // Clear the flag
        localStorage.removeItem('payment_initiated');
      }
    };

    // Listen for storage events (cross-tab communication)
    window.addEventListener('storage', handlePaymentRedirect);

    // Set up a listener for parent window responses if we're in an iframe
    if (isInIframe()) {
      const handleParentMessage = (event: MessageEvent) => {
        // Verify the message is something we expect
        if (event.data && event.data.type === 'PAYMENT_LINK_OPENED') {
          console.log('Parent confirmed payment link was opened');
          
          // Handle any post-payment flow, like navigation
          setTimeout(() => {
            navigate('/inventory');
          }, 1500);
        }
      };
      
      window.addEventListener('message', handleParentMessage);
      
      return () => {
        window.removeEventListener('storage', handlePaymentRedirect);
        window.removeEventListener('message', handleParentMessage);
      };
    }

    return () => {
      window.removeEventListener('storage', handlePaymentRedirect);
    };
  }, [navigate]);

  return (
    <CheckoutLayout>
      <CheckoutContainer />
    </CheckoutLayout>
  );
};

export default Checkout;
