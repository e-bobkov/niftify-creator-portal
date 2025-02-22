
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NFTCardProps {
  id: string;
  collectionId: string;
  title: string;
  image: string;
  price: number;
}

export const NFTCard = memo(({ id, collectionId, title, image, price }: NFTCardProps) => {
  const navigate = useNavigate();

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/my-collection/${collectionId}/${id}`);
  };

  return (
    <div className="group relative">
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="relative aspect-square">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
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
          <h3 className="font-semibold truncate">{title}</h3>
          <div className="text-sm text-primary font-medium">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
});

NFTCard.displayName = 'NFTCard';
