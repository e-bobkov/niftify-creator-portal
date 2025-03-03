
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  fetchTokenDetails, 
  checkTokenStatus, 
  verifyEncryptedData, 
  isEncryptedToken,
  autoAuthenticate,
  MarketplaceToken
} from "@/api/marketplace";

export function useCheckout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, user, isAuthenticated, login } = useAuth();
  
  const [item, setItem] = useState<MarketplaceToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilledEmail, setPrefilledEmail] = useState<string | undefined>(undefined);
  const [outTradeNo, setOutTradeNo] = useState<string | undefined>(undefined);

  const fetchItem = async (itemId: string) => {
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
            
            console.log('Auto-authentication successful, user ID:', userId);
            
            // Optional: you can update the global auth state if needed
            if (login) {
              login(authResult.session.access_token, authResult.session.user);
            }
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
      
      // Ensure we have a userId at this point
      if (!userId) {
        console.error('No user ID available for order creation');
        toast({
          title: "Authentication error",
          description: "Could not identify user for purchase. Please try logging in again.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }
      
      // Create request body
      const requestBody: any = {
        id: item.id.toString(),
        collection_id: item.collection_id,
        amount: item.price,
        buyer_id: userId // Using the userId from authenticated user or auto-authentication
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
          'Authorization': `Bearer ${userToken}`
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
      
      // Set a flag in localStorage to indicate payment has started
      // This will be used for cross-tab communication
      localStorage.setItem('payment_initiated', 'true');
      
      // Open payment link in new tab
      window.open(data.payment_link, '_blank');
      
      // Redirect to inventory after a short delay
      setTimeout(() => {
        navigate('/inventory');
      }, 1500);
      
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

  return {
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
  };
}
