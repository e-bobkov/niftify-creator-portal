
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthorById, useAuthorCollections, useAuthorCollectionTokens } from "@/hooks/useAuthor";
import { useToast } from "@/components/ui/use-toast";
import { NFTCard } from "@/components/NFTCard";
import { useEffect, useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { LoadingState } from "@/components/collection/LoadingState";

const AuthorCollection = () => {
  const { authorId, collectionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: author } = useAuthorById(authorId);
  
  const { 
    data: collections, 
    isLoading: isCollectionsLoading 
  } = useAuthorCollections(authorId);
  
  const { 
    data: tokens, 
    isLoading: isTokensLoading, 
    error: tokensError,
    prefetchCollectionTokens
  } = useAuthorCollectionTokens(authorId, collectionId);

  // Извлекаем данные о текущей коллекции
  const collection = useMemo(() => {
    return collections?.find(c => c.id === collectionId);
  }, [collections, collectionId]);

  // Обработка ошибок
  useEffect(() => {
    if (tokensError) {
      toast({
        title: "Error",
        description: "Failed to load collection tokens. Please try again later.",
        variant: "destructive"
      });
    }
  }, [tokensError, toast]);

  // Предварительная загрузка токенов коллекции
  useEffect(() => {
    if (authorId && collectionId && !tokens && !isTokensLoading) {
      prefetchCollectionTokens(authorId, collectionId);
    }
  }, [authorId, collectionId, tokens, isTokensLoading, prefetchCollectionTokens]);

  // Обработчик для перехода к деталям токена
  const handleTokenClick = useCallback((tokenId: number | string) => {
    if (authorId) {
      navigate(`/author/${authorId}/token/${tokenId}`);
    }
  }, [authorId, navigate]);

  // Обработчик для нажатия на контракт
  const handleContractClick = useCallback((address: string) => {
    if (address) {
      window.open(`https://polygonscan.com/address/${address}`, '_blank');
    }
  }, []);

  const isLoading = isTokensLoading || isCollectionsLoading || !collection;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(`/author/${authorId}`)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Author
        </Button>
        <div className="glass-card rounded-xl p-8 mt-4 text-center">
          <h2 className="text-xl font-semibold">Collection not found</h2>
          <p className="text-muted-foreground mt-2">
            The collection you're looking for might have been removed or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(`/author/${authorId}`)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to {author?.first_name}'s Collections
        </Button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-64 rounded-lg overflow-hidden">
            <img 
              src={collection.image_url || "/placeholder.svg"} 
              alt={collection.name} 
              className="w-full h-full object-cover"
              loading="eager" // Приоритетная загрузка изображения
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{collection.name}</h1>
            <p className="text-muted-foreground mb-4">{collection.description}</p>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Created</div>
                <div className="font-medium">
                  {format(new Date(collection.created_at), 'PP')}
                </div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1">Items</div>
                <div className="font-medium">{tokens?.length || 0}</div>
              </div>
              
              {collection.contract_address && (
                <div>
                  <div className="text-muted-foreground mb-1">Contract</div>
                  <button 
                    onClick={() => handleContractClick(collection.contract_address)}
                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    {collection.contract_address.slice(0, 6)}...{collection.contract_address.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Collection Items</h2>
        
        {!tokens?.length ? (
          <p className="text-muted-foreground text-center p-8">
            No items found in this collection
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <NFTCard
                key={token.token_id}
                id={token.id?.toString() || token.token_id.toString()}
                collectionId={token.collection_id}
                title={token.metadata?.name || `Token #${token.token_id}`}
                image={token.metadata?.image || "/placeholder.svg"}
                price={token.price || 0}
                soldAt={token.sold_at}
                showBuyButton={!token.sold_at}
                onExplore={() => {
                  if (token.id !== undefined) {
                    handleTokenClick(token.id);
                  } else {
                    console.error("Token id is undefined", token);
                    toast({
                      title: "Error",
                      description: "Could not navigate to token details",
                      variant: "destructive"
                    });
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorCollection;
