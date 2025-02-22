
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";
import { BaseComponentProps } from "@/types/common";

interface NFTCardProps extends BaseComponentProps {
  id: string;
  collectionId: string;
  title: string;
  image: string;
  price: number;
  onExplore?: () => void;
}

export const NFTCard = memo(({ 
  id, 
  collectionId, 
  title, 
  image, 
  price, 
  onExplore,
  className 
}: NFTCardProps) => {
  const navigate = useNavigate();

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExplore) {
      onExplore();
    } else {
      navigate(`/my-collection/${collectionId}/${id}`);
    }
  };

  return (
    <div className="group relative">
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="relative aspect-square">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <Button 
              variant="secondary" 
              size="lg" 
              className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-75 transition-all duration-300"
              onClick={handleExplore}
            >
              <Eye className="mr-2" />
              Explore
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold leading-tight break-words flex-1">{title}</h3>
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
