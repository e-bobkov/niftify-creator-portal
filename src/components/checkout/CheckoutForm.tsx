
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/format";
import { MarketplaceToken } from "@/api/marketplace";

interface CheckoutFormProps {
  item: MarketplaceToken;
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  onSubmit: (email?: string) => Promise<void>;
  processing: boolean;
}

export const CheckoutForm = ({ 
  item, 
  isAuthenticated, 
  user,
  token,
  onSubmit, 
  processing 
}: CheckoutFormProps) => {
  const [email, setEmail] = useState("");
  const [refundChecked, setRefundChecked] = useState(false);
  const [accountCreationChecked, setAccountCreationChecked] = useState(false);

  const handleSubmit = () => {
    onSubmit(isAuthenticated ? undefined : email);
  };

  const isFormValid = refundChecked && (isAuthenticated || (email && accountCreationChecked));

  return (
    <div className="space-y-4">
      {/* Authentication fields for non-authenticated users */}
      {!isAuthenticated && (
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Your Email Address
            </label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">We'll use this to create your account and send purchase details</p>
          </div>
          
          <div className="flex space-x-2 items-start">
            <Checkbox 
              id="accountCreation" 
              checked={accountCreationChecked}
              onCheckedChange={(checked) => setAccountCreationChecked(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="accountCreation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to create an account with this email
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Refund policy agreement */}
      <div className="flex space-x-2 items-start pt-2">
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
      
      <div className="pt-3 space-y-3">
        <div className="flex justify-between py-2 border-t border-b border-secondary/30">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
        </div>
        
        <Button 
          className="w-full py-5 text-base"
          disabled={!isFormValid || processing}
          onClick={handleSubmit}
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
  );
};
