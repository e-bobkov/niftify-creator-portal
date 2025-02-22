
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useCollections, useCollectionTokens } from "@/hooks/useCollections";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionDetails } from "@/components/collection/CollectionDetails";
import { CollectionTokens } from "@/components/collection/CollectionTokens";
import { LoadingState } from "@/components/collection/LoadingState";
import { ErrorMessage } from "@/components/ui/error-message";

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
    return <LoadingState />;
  }

  if (tokensError) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <ErrorMessage message="Failed to load collection tokens" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <CollectionHeader onBack={() => navigate(-1)} />
      
      {collection && (
        <>
          <CollectionDetails 
            collection={collection} 
            tokensCount={tokens?.length || 0}
            onShare={handleShare}
            tokens={tokens || []}
          />
          <CollectionTokens 
            tokens={tokens || []} 
            collectionId={id || ''}
          />
        </>
      )}
    </div>
  );
};

export default Collection;
