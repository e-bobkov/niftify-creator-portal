
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, FileText, Hash, Package, Link as LinkIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useMarketplaceTokenDetails } from "@/hooks/useMarketplace";
import { useToast } from "@/components/ui/use-toast";

const MarketplaceTokenDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: tokenDetails, isLoading, error } = useMarketplaceTokenDetails(tokenId);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load token details. Please try again later.",
      variant: "destructive"
    });
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-primary/10 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-primary/10 rounded w-1/3"></div>
            <div className="h-4 bg-primary/10 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenDetails) {
    return null;
  }

  const handleShare = () => {
    navigator.share?.({
      title: tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`,
      text: tokenDetails.metadata?.description || "",
      url: window.location.href
    }).catch(console.error);
  };

  const handleContractClick = () => {
    if (tokenDetails.address) {
      window.open(`https://polygonscan.com/address/${tokenDetails.address}`, '_blank');
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="aspect-[16/9] relative">
          <img 
            src={tokenDetails.metadata?.image || "/placeholder.svg"} 
            alt={tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`}
            </h1>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div>
                  <h2 className="text-sm font-medium mb-2">Description</h2>
                  <div className="text-sm text-muted-foreground">
                    {tokenDetails.metadata?.description || "No description available"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-medium text-lg flex items-center gap-2">Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contract Address
                </div>
                <button onClick={handleContractClick} className="font-medium font-mono text-primary hover:underline cursor-pointer">
                  {tokenDetails.address ? truncateAddress(tokenDetails.address) : 'N/A'}
                </button>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Token ID
                </div>
                <div className="font-medium">#{tokenDetails.token_id}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Token Standard
                </div>
                <div className="font-medium">{tokenDetails.standart || 'N/A'}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Chain
                </div>
                <div className="font-medium">{tokenDetails.chain}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Minted
                </div>
                <div className="font-medium">
                  {tokenDetails.minted_at ? format(new Date(tokenDetails.minted_at), 'PP') : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            {tokenDetails.sold_at ? (
              <div className="text-sm text-red-500 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Sold on {format(new Date(tokenDetails.sold_at), 'PP')}
              </div>
            ) : tokenDetails.price ? (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>${tokenDetails.price.toFixed(2)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceTokenDetails;
