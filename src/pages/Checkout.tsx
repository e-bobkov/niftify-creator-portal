import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchTokenDetails, checkTokenStatus } from "@/api/marketplace";
import { MarketplaceToken } from "@/api/marketplace";
import { useAuth } from "@/hooks/useAuth";

// Import refactored components
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { NFTPreview } from "@/components/checkout/NFTPreview";
import { NFTStorageInfo } from "@/components/checkout/NFTStorageInfo";
import { SecurityInfo } from "@/components/checkout/SecurityInfo";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { LoadingState } from "@/components/checkout/LoadingState";
import { ErrorState } from "@/components/checkout/ErrorState";
import { NotFoundState } from "@/components/checkout/NotFoundState";

const Checkout = () => {
  const { item: itemId } = useParams<{ item: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, user, isAuthenticated } = useAuth();
  
  const [item, setItem] = useState<MarketplaceToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkItem = async () => {
      if (!itemId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const isAvailable = await checkTokenStatus(itemId);
        
        if (!isAvailable) {
          setError('This NFT is no longer available for purchase.');
          toast({
            title: "Item unavailable",
            description: "This NFT has already been sold or is no longer available.",
            variant: "destructive"
          });
          
          // Redirect back after 3 seconds
          setTimeout(() => {
            navigate('/marketplace');
          }, 3000);
          
          return;
        }
        
        const itemData = await fetchTokenDetails(itemId);
        
        if (itemData.sold_at) {
          setError('This NFT has already been sold.');
          toast({
            title: "Item unavailable",
            description: "This NFT has already been sold.",
            variant: "destructive"
          });
          
          // Redirect back after 3 seconds
          setTimeout(() => {
            navigate('/marketplace');
          }, 3000);
          
          return;
        }
        
        setItem(itemData);
      } catch (err) {
        console.error('Error fetching token details:', err);
        setError('Failed to load item details. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load item details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkItem();
  }, [itemId, navigate, toast]);

  const handlePayment = async (email?: string) => {
    if (!item) {
      toast({
        title: "Error",
        description: "Item data is missing. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setProcessing(true);
      
      // Create request body
      const requestBody = {
        id: item.id.toString(),
        collection_id: item.collection_id,
        amount: item.price,
        buyer_id: isAuthenticated ? user?.id : email
      };
      
      console.log('Creating order with data:', requestBody);
      
      // Send request to create order
      const response = await fetch('https://test.ftsoa.art/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create order');
      }
      
      const data = await response.json();
      
      if (!data.payment_link) {
        throw new Error('Payment link not received from server');
      }
      
      toast({
        title: "Redirecting to payment",
        description: "You will be redirected to complete your payment.",
      });
      
      // Open payment link in new tab
      window.open(data.payment_link, '_blank');
      
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: "Payment failed",
        description: err instanceof Error ? err.message : "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

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

  // Normal checkout view with single column layout
  return (
    <CheckoutLayout>
      <div className="space-y-5">
        {/* NFT Preview at the top */}
        <NFTPreview item={item} />
        
        {/* Collapsible info sections */}
        <div className="space-y-3">
          <NFTStorageInfo />
          <SecurityInfo />
        </div>
        
        {/* Checkout form with payment button */}
        <CheckoutForm 
          item={item}
          isAuthenticated={isAuthenticated}
          user={user}
          token={token}
          onSubmit={handlePayment}
          processing={processing}
        />
      </div>
    </CheckoutLayout>
  );
};

export default Checkout;
