
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Calendar, Database, ExternalLink, Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { NFTCard } from "@/components/NFTCard";
import { useCollections, useCollectionTokens } from "@/hooks/useCollections";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Collection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: tokens, isLoading: tokensLoading, error: tokensError } = useCollectionTokens(id);
  const { data: collections, isLoading: collectionLoading } = useCollections();

  const collection = collections?.find(c => c.id === id);
  const isLoading = tokensLoading || collectionLoading;

  const handleShare = (platform: 'twitter' | 'telegram' | 'facebook') => {
    const url = window.location.href;
    const text = `Check out this NFT collection: ${collection?.name}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-primary/10 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="bg-primary/10 rounded-lg aspect-square mb-2"></div>
                <div className="h-4 bg-primary/10 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-primary/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tokensError) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load collection tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {collection && (
        <div className="glass-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img 
                src={collection.image_url} 
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>
                <p className="text-muted-foreground">{collection.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    {tokens?.length || 0} tokens minted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm">
                    {format(new Date(collection.created_at), 'PP')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={`https://polygonscan.com/address/${collection.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-sm">View on PolygonScan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Collection
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleShare('twitter')}>
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('telegram')}>
                      Share on Telegram
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('facebook')}>
                      Share on Facebook
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Collection Tokens</h2>
        {!tokens?.length ? (
          <div className="text-muted-foreground text-center p-8">
            No tokens in this collection
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.map((token) => (
              <NFTCard
                key={token.id}
                id={token.id.toString()}
                collectionId={id || ''}
                title={token.metadata.name}
                image={token.metadata.image}
                price={token.price || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
