
import { ShieldCheck, LockKeyhole } from "lucide-react";
import { CollapsibleInfo } from "./CollapsibleInfo";

export const SecurityInfo = () => {
  return (
    <CollapsibleInfo 
      title="Security Information" 
      icon={<ShieldCheck className="h-4 w-4" />}
    >
      <div className="flex gap-2 items-start">
        <ShieldCheck className="text-primary h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-sm">Secure Transaction</h4>
          <p className="text-xs text-muted-foreground">Your payment information is encrypted</p>
        </div>
      </div>
      <div className="flex gap-2 items-start">
        <LockKeyhole className="text-primary h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-sm">Ownership Transfer</h4>
          <p className="text-xs text-muted-foreground">NFT will be transferred to your account</p>
        </div>
      </div>
    </CollapsibleInfo>
  );
};
