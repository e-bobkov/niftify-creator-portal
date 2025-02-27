import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  LockKeyhole,
  AlertCircle,
  Check,
  Loader2,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/format";
import { fetchTokenDetails, checkTokenStatus } from "@/api/marketplace";
import { MarketplaceToken } from "@/api/marketplace";

const Checkout = () => {
  const { item: itemId } = useParams<{ item: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [item, setItem] = useState<MarketplaceToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [refundChecked, setRefundChecked] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');

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
    
    try {
      setProcessing(true);
      
      // Имитация запроса на обработку оплаты
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment successful!",
        description: "Thank you for your purchase. Your NFT will appear in your inventory shortly.",
      });
      
      // Перенаправляем на страницу инвентаря
      setTimeout(() => {
        navigate('/inventory');
      }, 1500);
      
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
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
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <Home className="h-3.5 w-3.5 mr-1" />
            Home
          </Button>
          <span className="mx-2">/</span>
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/marketplace')}
          >
            Marketplace
          </Button>
          <span className="mx-2">/</span>
          <span className="text-foreground">Checkout</span>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
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
                        <p className="text-xs text-muted-foreground">NFT will be transferred to your wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-3/5">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                            paymentMethod === 'card' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-secondary hover:border-primary/50'
                          }`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {paymentMethod === 'card' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Credit Card</span>
                        </div>
                        
                        <div className="border border-secondary rounded-lg p-4 flex items-center gap-3 opacity-50 cursor-not-allowed">
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center"></div>
                          <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1.75L5.75 12.25L12 16L18.25 12.25L12 1.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.75 13.5L12 17.25L18.25 13.5L12 22.25L5.75 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="font-medium">Crypto (Coming Soon)</span>
                        </div>
                      </div>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="card-number" className="block text-sm font-medium mb-1">Card Number</label>
                            <input
                              type="text"
                              id="card-number"
                              placeholder="0000 0000 0000 0000"
                              className="w-full px-3 py-2 bg-background/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiry" className="block text-sm font-medium mb-1">Expiry Date</label>
                              <input
                                type="text"
                                id="expiry"
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 bg-background/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                            <div>
                              <label htmlFor="cvc" className="block text-sm font-medium mb-1">CVC</label>
                              <input
                                type="text"
                                id="cvc"
                                placeholder="123"
                                className="w-full px-3 py-2 bg-background/50 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
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
