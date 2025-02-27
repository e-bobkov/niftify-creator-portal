
import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";
import { BaseComponentProps } from "@/types/common";

interface NFTCardProps extends BaseComponentProps {
  id: string;
  collectionId: string;
  title: string;
  image: string;
  price: number;
  soldAt?: string | null;
  owner?: {
    first_name: string;
    last_name: string;
  } | null;
  isMarketplace?: boolean;
  showBuyButton?: boolean;
  onExplore?: () => void;
  onBuy?: () => void;
}

export const NFTCard = memo(({ 
  id, 
  collectionId, 
  title, 
  image, 
  price, 
  soldAt,
  owner,
  isMarketplace = false,
  showBuyButton = false,
  onExplore,
  onBuy,
  className 
}: NFTCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleExplore = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (onExplore) {
      onExplore();
    } else if (isMarketplace) {
      // Для маркетплейса используем только числовой ID токена
      navigate(`/marketplace/${id}`);
    } else {
      navigate(`/my-collection/${collectionId}/${id}`);
    }
  }, [onExplore, isMarketplace, navigate, id, collectionId]);

  const handleBuy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuy) {
      onBuy();
    } else {
      // Placeholder for future buy functionality
      console.log("Buy clicked for token", id);
    }
  }, [onBuy, id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="group relative">
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="relative aspect-square">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
          
          <img
            src={imageError ? "/placeholder.svg" : image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              <Button 
                variant="secondary" 
                size="lg" 
                className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-75 transition-all duration-300"
                onClick={handleExplore}
              >
                <Eye className="mr-2" />
                Explore
              </Button>
              
              {showBuyButton && !soldAt && price > 0 && (
                <Button 
                  variant="default" 
                  size="lg" 
                  className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-75 transition-all duration-300"
                  onClick={handleBuy}
                >
                  <ShoppingCart className="mr-2" />
                  Buy Now
                </Button>
              )}
            </div>
          </div>
          
          <div className="absolute top-2 right-2">
            <Badge variant={soldAt ? "destructive" : "secondary"}>
              {soldAt ? "Sold" : "Available"}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold leading-tight break-words">{title}</h3>
              {owner && (
                <p className="text-sm text-muted-foreground mt-1">
                  Owned by: {owner.first_name} {owner.last_name}
                </p>
              )}
            </div>
            <div className="text-sm text-primary font-medium whitespace-nowrap">
              {formatPrice(price)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

NFTCard.displayName = 'NFTCard';
