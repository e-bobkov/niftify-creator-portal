
import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";
import { BaseComponentProps } from "@/types/common";

// Функция для получения градиента для коллекции на основе её ID
const getCollectionGradient = (collectionId?: string) => {
  if (!collectionId) return 'bg-secondary/20';
  
  // Используем последние символы ID для определения градиента
  const lastChar = collectionId.slice(-1).charCodeAt(0);
  
  const gradients = [
    'bg-gradient-to-r from-[#F2FCE2] to-[#E2D1C3]', // Soft Green (убрали прозрачность)
    'bg-gradient-to-r from-[#FEF7CD] to-[#FEC6A1]', // Soft Yellow (убрали прозрачность)
    'bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD]', // Soft Purple (убрали прозрачность)
    'bg-gradient-to-r from-[#FFDEE2] to-[#FDE1D3]', // Soft Pink (убрали прозрачность)
    'bg-gradient-to-r from-[#D3E4FD] to-[#F1F0FB]', // Soft Blue (убрали прозрачность)
  ];
  
  return gradients[lastChar % gradients.length];
};

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
  collectionName?: string;
  authorId?: string;
  authorName?: string;
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
  className,
  collectionName,
  authorId,
  authorName
}: NFTCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleExplore = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (onExplore) {
      onExplore();
    } else if (isMarketplace) {
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
      console.log("Buy clicked for token", id);
    }
  }, [onBuy, id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Изменяем обработчик клика на коллекцию для перехода по пути /author/:partner_id/collection/:collection_id
  const handleCollectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (collectionId && authorId) {
      navigate(`/author/${authorId}/collection/${collectionId}`);
    } else if (collectionId && isMarketplace) {
      // Для маркетплейса без указания автора
      navigate(`/marketplace/collection/${collectionId}`);
    } else if (collectionId) {
      // Для других случаев
      navigate(`/collection/${collectionId}`);
    }
  }, [collectionId, authorId, isMarketplace, navigate]);

  // Отдельная функция для клика на автора
  const handleAuthorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (authorId) {
      navigate(`/author/${authorId}`);
    }
  }, [authorId, navigate]);

  const collectionGradient = getCollectionGradient(collectionId);

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
            fetchPriority="auto"
          />
          
          {/* Collection Badge в левом верхнем углу с градиентом */}
          {collectionName && (
            <div className="absolute top-2 left-2 max-w-[70%] z-10">
              <div 
                className={`${collectionGradient} backdrop-blur-sm px-2 py-1 rounded-full truncate cursor-pointer hover:opacity-80 transition-colors text-xs font-medium border border-white/10 shadow-sm text-black`}
                onClick={handleCollectionClick}
              >
                {collectionName}
              </div>
            </div>
          )}
          
          {/* Status Badge - только не на маркетплейсе */}
          {!isMarketplace && (
            <div className="absolute top-2 right-2">
              <Badge variant={soldAt ? "destructive" : "secondary"}>
                {soldAt ? "Sold" : "Available"}
              </Badge>
            </div>
          )}
          
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
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold leading-tight break-words">{title}</h3>
              
              {authorName && (
                <p className="text-sm text-muted-foreground mt-1 cursor-pointer hover:text-primary" onClick={handleAuthorClick}>
                  By: {authorName}
                </p>
              )}
              
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
