
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, FileText, Hash, Package, Link as LinkIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuthorById, useAuthorCollectionTokens } from "@/hooks/useAuthor";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useMemo } from "react";

const AuthorToken = () => {
  const { authorId, tokenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: author } = useAuthorById(authorId);
  const { data: tokens } = useAuthorCollectionTokens(authorId, undefined);
  
  const token = useMemo(() => {
    if (!tokens || !tokenId) return null;
    
    // Find the token with the matching ID
    return tokens.find(t => t.id === Number(tokenId)) || null;
  }, [tokens, tokenId]);

  useEffect(() => {
    if (!token && tokens) {
      toast({
        title: "Error",
        description: "Token not found",
        variant: "destructive"
      });
    }
  }, [token, tokens, toast]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="glass-card rounded-xl p-8 mt-4 text-center">
          <h2 className="text-xl font-semibold">Token not found</h2>
          <p className="text-muted-foreground mt-2">
            The token you're looking for might have been removed or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.share?.({
      title: token.metadata?.name || `Token #${token.token_id}`,
      text: token.metadata?.description || "",
      url: window.location.href
    }).catch(console.error);
  };

  const handleContractClick = () => {
    if (token.address) {
      window.open(`https://polygonscan.com/address/${token.address}`, '_blank');
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
          Back
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="aspect-[16/9] relative">
          <img 
            src={token.metadata?.image || "/placeholder.svg"} 
            alt={token.metadata?.name || `Token #${token.token_id}`} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {token.metadata?.name || `Token #${token.token_id}`}
            </h1>
            
            {author && (
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-primary"
                  onClick={() => navigate(`/author/${author.id}`)}
                >
                  <span>By {author.first_name} {author.last_name}</span>
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div>
                  <h2 className="text-sm font-medium mb-2">Description</h2>
                  <div className="text-sm text-muted-foreground">
                    {token.metadata?.description || "No description available"}
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
                  {token.address ? truncateAddress(token.address) : 'N/A'}
                </button>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Token ID
                </div>
                <div className="font-medium">#{token.token_id}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Token Standard
                </div>
                <div className="font-medium">{token.standart || 'N/A'}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Chain
                </div>
                <div className="font-medium">{token.chain}</div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Minted
                </div>
                <div className="font-medium">
                  {token.minted_at ? format(new Date(token.minted_at), 'PP') : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            {token.sold_at ? (
              <div className="text-sm text-red-500 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Sold on {format(new Date(token.sold_at), 'PP')}
              </div>
            ) : token.price ? (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>${token.price.toFixed(2)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorToken;
