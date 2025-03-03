
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchTokenDetails, 
  checkTokenStatus, 
  verifyEncryptedData, 
  isEncryptedToken,
  autoAuthenticate
} from "@/api/marketplace";
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
  const { token, user, isAuthenticated, login } = useAuth();
  
  const [item, setItem] = useState<MarketplaceToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilledEmail, setPrefilledEmail] = useState<string | undefined>(undefined);
  const [outTradeNo, setOutTradeNo] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkItem = async () => {
      if (!itemId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if the item ID is an encrypted token or a regular ID
        if (isEncryptedToken(itemId)) {
          // Process encrypted token
          console.log('Processing encrypted checkout link:', itemId);
          
          try {
            const verifyResult = await verifyEncryptedData(itemId);
            
            // Set the token data from the verification result
            setItem(verifyResult.token);
            
            // If the response includes an email and user is not authenticated, prefill it
            if (verifyResult.email && !isAuthenticated) {
              setPrefilledEmail(verifyResult.email);
              console.log('Prefilling email from encrypted link:', verifyResult.email);
            }
            
            // Store out_trade_no if it's provided
            if (verifyResult.out_trade_no) {
              setOutTradeNo(verifyResult.out_trade_no);
              console.log('Received out_trade_no:', verifyResult.out_trade_no);
            }
          } catch (encryptedError) {
            console.error('Error processing encrypted token:', encryptedError);
            setError('Invalid or expired checkout link. Please try again with a valid link.');
            toast({
              title: "Invalid link",
              description: "This checkout link is invalid or has expired.",
              variant: "destructive"
            });
          }
          
          return;
        }
        
        // Regular token ID flow
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
  }, [itemId, navigate, toast, isAuthenticated]);

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
      
      let userToken = token;
      let userId = user?.id;
      
      // If user is not authenticated but we have an email, auto-authenticate them
      if (!isAuthenticated && email) {
        try {
          console.log('Auto-authenticating user with email:', email);
          const authResult = await autoAuthenticate(email);
          
          if (authResult && authResult.session) {
            // Store the user session
            userToken = authResult.session.access_token;
            userId = authResult.session.user.id;
            
            console.log('Auto-authentication successful');
            
            // Optional: you can update the global auth state if needed
            // This depends on how your auth state management works
          }
        } catch (authError) {
          console.error('Auto-authentication failed:', authError);
          toast({
            title: "Authentication failed",
            description: "Could not authenticate with the provided email.",
            variant: "destructive"
          });
          setProcessing(false);
          return;
        }
      }
      
      // Create request body
      const requestBody: any = {
        id: item.id.toString(),
        collection_id: item.collection_id,
        amount: item.price,
        buyer_id: isAuthenticated ? user?.id : email
      };
      
      // Add out_trade_no if available
      if (outTradeNo) {
        requestBody.out_trade_no = outTradeNo;
      }
      
      console.log('Creating order with data:', requestBody);
      
      // Send request to create order
      const response = await fetch('https://test.ftsoa.art/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken || token}`
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
          prefilledEmail={prefilledEmail}
        />
      </div>
    </CheckoutLayout>
  );
};

export default Checkout;
