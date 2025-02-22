
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, Share2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Token } from "@/types/user";

const TokenDetails = () => {
  const { collectionId, tokenId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const { data: tokensData, isLoading } = useQuery({
    queryKey: ['collection-tokens', collectionId],
    queryFn: async (): Promise<Token[]> => {
      const response = await fetch('https://test.ftsoa.art/profile/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          collection_id: collectionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }

      const data = await response.json();
      return data.tokens;
    },
    enabled: !!token && !!collectionId
  });

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

  const tokenDetails = tokensData?.find(t => t.id.toString() === tokenId);

  if (!tokenDetails) {
    return null;
  }

  const handleShare = () => {
    navigator.share?.({
      title: tokenDetails.metadata.name,
      text: tokenDetails.metadata.description,
      url: window.location.href
    }).catch(console.error);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[#9b87f5]">NeonOracle</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-lg p-6 grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-8">
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <img 
            src={tokenDetails.metadata.image} 
            alt={tokenDetails.metadata.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-6">{tokenDetails.metadata.name}</h1>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {tokenDetails.metadata.description}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-muted-foreground">Contract Address</div>
              <div className="font-medium">{tokenDetails.address || 'N/A'}</div>
              
              <div className="text-muted-foreground">Token ID</div>
              <div className="font-medium">#{tokenDetails.token_id}</div>
              
              <div className="text-muted-foreground">Token Standard</div>
              <div className="font-medium">{tokenDetails.standart || 'N/A'}</div>
              
              <div className="text-muted-foreground">Chain</div>
              <div className="font-medium">{tokenDetails.chain}</div>
              
              <div className="text-muted-foreground">Last Updated</div>
              <div className="font-medium">
                {tokenDetails.updated_at 
                  ? format(new Date(tokenDetails.updated_at), 'PP') 
                  : 'N/A'}
              </div>
              
              <div className="text-muted-foreground">Minted</div>
              <div className="font-medium">
                {format(new Date(tokenDetails.minted_at), 'PP')}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            {tokenDetails.sold_at ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Sold on {format(new Date(tokenDetails.sold_at), 'PP')}</span>
              </div>
            ) : tokenDetails.price ? (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <DollarSign className="w-5 h-5" />
                <span>${tokenDetails.price.toFixed(2)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
