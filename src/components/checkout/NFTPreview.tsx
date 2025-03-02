
import { MarketplaceToken } from "@/api/marketplace";
import { formatPrice } from "@/utils/format";

interface NFTPreviewProps {
  item: MarketplaceToken;
}

export const NFTPreview = ({ item }: NFTPreviewProps) => {
  return (
    <div className="glass-card rounded-lg overflow-hidden p-3 flex items-center gap-3">
      {/* Thumbnail image */}
      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
        <img 
          src={item.metadata.image} 
          alt={item.metadata.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name and price */}
      <div className="flex-1">
        <h3 className="font-semibold text-base">{item.metadata.name}</h3>
        <span className="text-primary font-bold">{formatPrice(item.price)}</span>
      </div>
    </div>
  );
};
