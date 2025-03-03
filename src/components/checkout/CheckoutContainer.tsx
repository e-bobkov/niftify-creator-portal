
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCheckout } from "@/hooks/useCheckout";
import { LoadingState } from "@/components/checkout/LoadingState";
import { ErrorState } from "@/components/checkout/ErrorState";
import { NotFoundState } from "@/components/checkout/NotFoundState";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const CheckoutContainer = () => {
  const { item: itemId } = useParams<{ item: string }>();
  const {
    item,
    loading,
    error,
    processing,
    prefilledEmail,
    isAuthenticated,
    user,
    token,
    fetchItem,
    handlePayment,
  } = useCheckout();

  useEffect(() => {
    if (itemId) {
      fetchItem(itemId);
    }
  }, [itemId]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  // Not found state
  if (!item) {
    return <NotFoundState />;
  }

  // Normal checkout view
  return (
    <CheckoutContent 
      item={item}
      isAuthenticated={isAuthenticated}
      user={user}
      token={token}
      onSubmit={handlePayment}
      processing={processing}
      prefilledEmail={prefilledEmail}
    />
  );
};
