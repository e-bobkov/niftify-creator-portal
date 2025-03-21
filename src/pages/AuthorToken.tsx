
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, FileText, Hash, Package, Link as LinkIcon, Calendar, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuthorById, useAuthorCollectionTokens } from "@/hooks/useAuthor";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useMemo, useCallback } from "react";
import { LoadingState } from "@/components/collection/LoadingState";

const AuthorToken = () => {
  const { authorId, tokenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: author } = useAuthorById(authorId);
  const { data: tokens, isLoading: isTokensLoading } = useAuthorCollectionTokens(authorId, undefined);
  
  // Находим конкретный токен из массива токенов
  const token = useMemo(() => {
    if (!tokens || !tokenId) return null;
    
    // Пытаемся найти токен по ID
    return tokens.find(t => t.id === Number(tokenId)) || null;
  }, [tokens, tokenId]);

  // Обработка случая, когда токен не найден
  useEffect(() => {
    if (!token && !isTokensLoading && tokens) {
      toast({
        title: "Error",
        description: "Token not found",
        variant: "destructive"
      });
    }
  }, [token, tokens, isTokensLoading, toast]);

  // Обработчик для функции поделиться
  const handleShare = useCallback(() => {
    if (!token) return;
    
    navigator.share?.({
      title: token.metadata?.name || `Token #${token.token_id}`,
      text: token.metadata?.description || "",
      url: window.location.href
    }).catch(console.error);
  }, [token]);

  // Обработчик для клика на контракт
  const handleContractClick = useCallback(() => {
    if (token?.address) {
      window.open(`https://polygonscan.com/nft/${token.address}/${token.token_id}`, '_blank');
    }
  }, [token]);

  // Обработчик для клика на кнопку купить
  const handleBuy = useCallback(() => {
    if (!token) return;
    
    toast({
      title: "Purchase initiated",
      description: `You are about to purchase ${token.metadata?.name || `Token #${token.token_id}`}`,
    });
  }, [token, toast]);

  // Хелпер для сокращения адреса
  const truncateAddress = useCallback((address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  if (isTokensLoading) {
    return <LoadingState />;
  }

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

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
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
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div className="aspect-square relative">
              <img 
                src={token.metadata?.image || "/placeholder.svg"} 
                alt={token.metadata?.name || `Token #${token.token_id}`} 
                className="w-full h-full object-cover"
                loading="eager" // Приоритетная загрузка изображения
              />
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8 space-y-6">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-sm">
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
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    <span>${token.price.toFixed(2)}</span>
                  </div>
                  <Button onClick={handleBuy} className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorToken;
