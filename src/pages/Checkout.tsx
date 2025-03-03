
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { CheckoutContainer } from "@/components/checkout/CheckoutContainer";

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
