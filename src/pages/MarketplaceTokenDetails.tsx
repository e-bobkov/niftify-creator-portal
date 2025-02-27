
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, FileText, Hash, Package, Link as LinkIcon, Calendar, User, ShoppingCart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useMarketplaceTokenDetails } from "@/hooks/useMarketplace";
import { useAuthorByTokenId } from "@/hooks/useAuthor";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useCallback, useState } from "react";
import { LoadingState } from "@/components/collection/LoadingState";

interface Breadcrumb {
  path: string;
  label: string;
}

const MarketplaceTokenDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const { 
    data: tokenDetails, 
    isLoading: isTokenLoading, 
    error: tokenError 
  } = useMarketplaceTokenDetails(tokenId);
  
  const { 
    data: author, 
    isLoading: isAuthorLoading, 
    prefetchAuthorByToken 
  } = useAuthorByTokenId(tokenDetails?.id);

  // Обработка ошибок
  useEffect(() => {
    if (tokenError) {
      toast({
        title: "Error",
        description: "Failed to load token details. Please try again later.",
        variant: "destructive"
      });
    }
  }, [tokenError, toast]);

  // Загружаем хлебные крошки из sessionStorage
  useEffect(() => {
    const savedBreadcrumbs = sessionStorage.getItem('breadcrumbs');
    if (savedBreadcrumbs) {
      try {
        const parsedBreadcrumbs = JSON.parse(savedBreadcrumbs) as Breadcrumb[];
        setBreadcrumbs(parsedBreadcrumbs);
      } catch (e) {
        console.error('Failed to parse breadcrumbs:', e);
      }
    }
    
    // Если нет сохраненных хлебных крошек, создаем базовые
    if (!savedBreadcrumbs) {
      setBreadcrumbs([
        { path: '/marketplace', label: 'Marketplace' },
        { path: `/marketplace/${tokenId}`, label: 'Token Details' }
      ]);
    }
  }, [tokenId]);

  // Обновляем хлебные крошки когда получаем данные о токене
  useEffect(() => {
    if (tokenDetails) {
      const currentBreadcrumbs = [...breadcrumbs];
      // Обновляем последний элемент, если он относится к текущему токену
      if (currentBreadcrumbs.length > 1 && currentBreadcrumbs[currentBreadcrumbs.length - 1].path.includes(tokenId || '')) {
        currentBreadcrumbs[currentBreadcrumbs.length - 1].label = 
          tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`;
        setBreadcrumbs(currentBreadcrumbs);
      }
    }
  }, [tokenDetails, tokenId, breadcrumbs]);

  // Предварительно загружаем данные об авторе, как только получаем данные о токене
  useEffect(() => {
    if (tokenDetails?.id) {
      prefetchAuthorByToken(tokenDetails.id);
    }
  }, [tokenDetails, prefetchAuthorByToken]);

  const handleShare = useCallback(() => {
    if (!tokenDetails) return;
    
    navigator.share?.({
      title: tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`,
      text: tokenDetails.metadata?.description || "",
      url: window.location.href
    }).catch(console.error);
  }, [tokenDetails]);

  const handleContractClick = useCallback(() => {
    if (tokenDetails?.address) {
      window.open(`https://polygonscan.com/nft/${tokenDetails.address}/${tokenDetails.token_id}`, '_blank');
    }
  }, [tokenDetails]);

  const handleBuy = useCallback(() => {
    if (!tokenDetails) return;
    
    // Placeholder for future buy functionality
    toast({
      title: "Purchase initiated",
      description: `You are about to purchase ${tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`}`,
    });
  }, [tokenDetails, toast]);

  const handleAuthorClick = useCallback(() => {
    if (author) {
      // Добавляем к хлебным крошкам автора
      const newBreadcrumbs = [
        ...breadcrumbs,
        { path: `/author/${author.id}`, label: `${author.first_name} ${author.last_name}` }
      ];
      sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
      navigate(`/author/${author.id}`);
    }
  }, [author, navigate, breadcrumbs]);

  const truncateAddress = useCallback((address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const isLoading = isTokenLoading || isAuthorLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!tokenDetails) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
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
      {/* Хлебные крошки */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <Home className="h-3.5 w-3.5 mr-1" />
          Home
        </Button>
        
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center">
            <span className="mx-2">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground">{crumb.label}</span>
            ) : (
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                onClick={() => navigate(crumb.path)}
              >
                {crumb.label}
              </Button>
            )}
          </span>
        ))}
      </div>
    
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
                src={tokenDetails.metadata?.image || "/placeholder.svg"} 
                alt={tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`} 
                className="w-full h-full object-cover"
                loading="eager" // Приоритетная загрузка изображения
              />
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">
                {tokenDetails.metadata?.name || `Token #${tokenDetails.token_id}`}
              </h1>
              
              {author && (
                <div className="flex items-center gap-2 mb-4">
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-primary"
                    onClick={handleAuthorClick}
                  >
                    <User className="w-4 h-4" />
                    <span>By {author.first_name} {author.last_name}</span>
                  </Button>
                </div>
              )}
              
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-sm">
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
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    <span>${tokenDetails.price.toFixed(2)}</span>
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

export default MarketplaceTokenDetails;
