
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ShieldCheck,
  LockKeyhole,
  AlertCircle,
  Check,
  Loader2,
  Home,
  Info,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/format";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { fetchTokenDetails, checkTokenStatus } from "@/api/marketplace";
import { MarketplaceToken } from "@/api/marketplace";
import { useAuth } from "@/hooks/useAuth";

const Checkout = () => {
  const { item: itemId } = useParams<{ item: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, user } = useAuth(); // Получаем данные авторизации
  
  const [item, setItem] = useState<MarketplaceToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [refundChecked, setRefundChecked] = useState(false);

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
          
          // Перенаправляем обратно через 3 секунды
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
          
          // Перенаправляем обратно через 3 секунды
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

  const handlePayment = async () => {
    if (!termsChecked || !privacyChecked || !refundChecked) {
      toast({
        title: "Please check all agreements",
        description: "You must agree to all terms before proceeding with payment.",
        variant: "destructive"
      });
      return;
    }
    
    if (!item) {
      toast({
        title: "Error",
        description: "Item data is missing. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user || !user.id || !token) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to complete this purchase.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Создаем тело запроса
      const requestBody = {
        id: item.id.toString(), // Преобразуем в строку, если это число
        collection_id: item.collection_id, // Используем строковый идентификатор коллекции без преобразования
        amount: item.price,
        buyer_id: user.id
      };
      
      console.log('Creating order with data:', requestBody);
      
      // Отправляем запрос на создание заказа
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
      
      // Открываем платежную ссылку в новой вкладке
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Checking item availability...</h3>
          <p className="text-muted-foreground mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-lg px-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Item Unavailable</h3>
          <p className="text-muted-foreground mt-2 mb-6">{error}</p>
          <Button onClick={() => navigate('/marketplace')}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Item Not Found</h3>
          <p className="text-muted-foreground mt-2 mb-6">We couldn't find this item in our marketplace.</p>
          <Button onClick={() => navigate('/marketplace')}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplace')} // Всегда ведёт на страницу маркетплейса
            className="mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Complete your purchase</h1>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/5">
                  <div className="glass-card rounded-lg overflow-hidden">
                    <div className="aspect-square">
                      <img 
                        src={item.metadata.image} 
                        alt={item.metadata.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{item.metadata.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.metadata.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Price:</span>
                        <span className="text-primary font-bold">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3 bg-secondary/20 p-4 rounded-lg border border-secondary/40">
                    <div className="flex gap-3 items-center">
                      <ShieldCheck className="text-primary h-5 w-5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Secure Transaction</h4>
                        <p className="text-xs text-muted-foreground">Your payment information is encrypted</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <LockKeyhole className="text-primary h-5 w-5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">Ownership Transfer</h4>
                        <p className="text-xs text-muted-foreground">NFT will be transferred to your account</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-3/5">
                  <div className="space-y-6">
                    <Alert className="bg-[#d7ff6b]/10 border-[#bcf655]/30">
                      <Info className="h-5 w-5 text-[#bcf655]" />
                      <AlertTitle className="font-semibold text-[#bcf655]">NFT Storage Information</AlertTitle>
                      <AlertDescription className="text-sm">
                        <p className="mb-2">
                          All NFTs are stored centrally on our platform's wallet for enhanced security and ease of access.
                        </p>
                        <div className="flex items-center gap-1 text-xs font-medium text-[#bcf655] hover:text-[#d7ff6b]">
                          <a 
                            href="https://polygonscan.com/address/0xe2Ab5329EccBb90fC3EB4542ff674e096A304f36" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            View platform wallet on Polygonscan
                            <ExternalLink className="h-3 w-3 ml-1 text-[#bcf655]" />
                          </a>
                        </div>
                        <p className="mt-2">
                          Upon purchase, you become the rightful owner and your ownership details will be securely encrypted in the NFT's metadata.
                        </p>
                      </AlertDescription>
                    </Alert>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        By proceeding with this purchase, you agree to pay {formatPrice(item.price)} for this NFT.
                        The payment will be processed securely once you click the "Pay Now" button below.
                      </p>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      <h3 className="text-lg font-semibold mb-2">Agreements</h3>
                      
                      <div className="flex space-x-2 items-start">
                        <Checkbox 
                          id="terms" 
                          checked={termsChecked}
                          onCheckedChange={(checked) => setTermsChecked(checked === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 items-start">
                        <Checkbox 
                          id="privacy" 
                          checked={privacyChecked}
                          onCheckedChange={(checked) => setPrivacyChecked(checked === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="privacy"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 items-start">
                        <Checkbox 
                          id="refund" 
                          checked={refundChecked}
                          onCheckedChange={(checked) => setRefundChecked(checked === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="refund"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the <Link to="/refund" className="text-primary hover:underline" target="_blank">Refund and Transaction Cancellation Policy</Link>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-4">
                      <div className="flex justify-between py-2 border-t border-b border-secondary/30">
                        <span className="font-semibold">Total</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                      </div>
                      
                      <Button 
                        className="w-full py-6 text-base"
                        disabled={!termsChecked || !privacyChecked || !refundChecked || processing}
                        onClick={handlePayment}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay Now {formatPrice(item.price)}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center mb-2">
              <LockKeyhole className="h-4 w-4 mr-1" />
              <span>Secure Checkout</span>
            </div>
            <p>All transactions are encrypted and secure. Your payment information is never stored on our servers.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
