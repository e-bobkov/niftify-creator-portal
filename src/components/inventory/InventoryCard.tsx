
import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";

export interface InventoryItem {
  id: string;
  title: string;
  image: string;
  price: number;
  collectionId: string;
  collectionName: string;
  authorId: string;
  authorName: string;
  tokenId: string;
  rarity: "common" | "uncommon" | "rare" | "legendary" | "mythic";
  acquiredAt: string;
}

const rarityConfig = {
  common: {
    color: "bg-slate-400",
    label: "Common",
    borderGlow: "group-hover:shadow-slate-500/30"
  },
  uncommon: {
    color: "bg-green-500",
    label: "Uncommon",
    borderGlow: "group-hover:shadow-green-500/30"
  },
  rare: {
    color: "bg-blue-500",
    label: "Rare",
    borderGlow: "group-hover:shadow-blue-500/30"
  },
  legendary: {
    color: "bg-purple-500",
    label: "Legendary",
    borderGlow: "group-hover:shadow-purple-500/30"
  },
  mythic: {
    color: "bg-yellow-400",
    label: "Mythic",
    borderGlow: "group-hover:shadow-yellow-400/30"
  }
};

export const InventoryCard = memo(({ item }: { item: InventoryItem }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const rarityInfo = rarityConfig[item.rarity];

  const handleExplore = useCallback(() => {
    navigate(`/my-collection/${item.collectionId}/${item.id}`);
  }, [navigate, item]);

  const handleFlip = useCallback(() => {
    setIsRotated(!isRotated);
  }, [isRotated]);

  const handleAuthorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/author/${item.authorId}`);
  }, [navigate, item.authorId]);

  const handleCollectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/author/${item.authorId}/collection/${item.collectionId}`);
  }, [navigate, item.authorId, item.collectionId]);

  return (
    <div className="inventory-item-perspective">
      <div 
        className={`inventory-item ${isRotated ? 'rotated' : ''} group`}
        onClick={handleFlip}
      >
        {/* Лицевая сторона карточки */}
        <div className={`inventory-item-front glass-card rounded-lg overflow-hidden ${rarityInfo.borderGlow}`}>
          <div className="relative aspect-square overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            )}
            
            <img
              src={item.image}
              alt={item.title}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <div className={`h-3 w-3 rounded-full ${rarityInfo.color} animate-pulse`}></div>
              <Badge variant="outline" className="bg-black/40 backdrop-blur-sm text-xs font-semibold">
                {rarityInfo.label}
              </Badge>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-sm text-white font-semibold truncate">{item.title}</p>
              <p className="text-xs text-white/80 truncate">
                Collection: <span className="hover:text-primary cursor-pointer" onClick={handleCollectionClick}>{item.collectionName}</span>
              </p>
            </div>

            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleExplore();
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
        
        {/* Задняя сторона карточки (информация) */}
        <div className="inventory-item-back glass-card rounded-lg p-4 space-y-3">
          <h3 className="font-bold text-base">{item.title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collection:</span>
              <span 
                className="truncate max-w-[120px] text-primary cursor-pointer hover:underline"
                onClick={handleCollectionClick}
              >
                {item.collectionName}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creator:</span>
              <span 
                className="truncate max-w-[120px] text-primary cursor-pointer hover:underline"
                onClick={handleAuthorClick}
              >
                {item.authorName}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rarity:</span>
              <span className="font-semibold">
                <span className={`inline-block h-2 w-2 rounded-full ${rarityInfo.color} mr-1`}></span>
                {rarityInfo.label}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Acquired:</span>
              <span className="font-medium">{new Date(item.acquiredAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleFlip}>
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Flip card back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleExplore();
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

InventoryCard.displayName = 'InventoryCard';
