
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthorById, useAuthorCollections, useAuthorCollectionTokens } from "@/hooks/useAuthor";
import { useToast } from "@/components/ui/use-toast";
import { NFTCard } from "@/components/NFTCard";
import { useEffect } from "react";

const AuthorCollection = () => {
  const { authorId, collectionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: author } = useAuthorById(authorId);
  const { data: collections } = useAuthorCollections(authorId);
  const { 
    data: tokens, 
    isLoading: isTokensLoading, 
    error: tokensError 
  } = useAuthorCollectionTokens(authorId, collectionId);

  const collection = collections?.find(c => c.id === collectionId);

  useEffect(() => {
    if (tokensError) {
      toast({
        title: "Error",
        description: "Failed to load collection tokens. Please try again later.",
        variant: "destructive"
      });
    }
  }, [tokensError, toast]);

  if (isTokensLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="animate-pulse space-y-8">
          <div className="h-20 bg-primary/10 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-primary/10 rounded-lg"></div>
            ))}
          </div>
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

      {collection && (
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-64 rounded-lg overflow-hidden">
              <img 
                src={collection.image_url || "/placeholder.svg"} 
                alt={collection.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{collection.name}</h1>
              <p className="text-muted-foreground mb-4">{collection.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>{' '}
                  {new Date(collection.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-muted-foreground">Items:</span>{' '}
                  {tokens?.length || 0}
                </div>
                {collection.contract_address && (
                  <div>
                    <span className="text-muted-foreground">Contract:</span>{' '}
                    <a 
                      href={`https://polygonscan.com/address/${collection.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {collection.contract_address.slice(0, 6)}...{collection.contract_address.slice(-4)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                onExplore={() => navigate(`/author/${authorId}/token/${token.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorCollection;
