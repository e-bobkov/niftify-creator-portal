
import { NFTPreview } from "@/components/checkout/NFTPreview";
import { NFTStorageInfo } from "@/components/checkout/NFTStorageInfo";
import { SecurityInfo } from "@/components/checkout/SecurityInfo";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { MarketplaceToken } from "@/api/marketplace";

interface CheckoutContentProps {
  item: MarketplaceToken;
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  onSubmit: (email?: string) => Promise<void>;
  processing: boolean;
  prefilledEmail?: string;
}

export const CheckoutContent = ({
  item,
  isAuthenticated,
  user,
  token,
  onSubmit,
  processing,
  prefilledEmail
}: CheckoutContentProps) => {
  return (
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
        onSubmit={onSubmit}
        processing={processing}
        prefilledEmail={prefilledEmail}
      />
    </div>
  );
};
