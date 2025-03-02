
import { MarketplaceToken } from "@/api/marketplace";
import { formatPrice } from "@/utils/format";

interface NFTPreviewProps {
  item: MarketplaceToken;
}

export const NFTPreview = ({ item }: NFTPreviewProps) => {
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="aspect-square">
        <img 
          src={item.metadata.image} 
          alt={item.metadata.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-lg">{item.metadata.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.metadata.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Price:</span>
          <span className="text-primary font-bold">{formatPrice(item.price)}</span>
        </div>
      </div>
    </div>
  );
};
