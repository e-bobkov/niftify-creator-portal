
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface NFTCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  creator: string;
  likes: number;
}

export const NFTCard = ({ id, title, image, price, creator, likes }: NFTCardProps) => {
  return (
    <Link to={`/nft/${id}`} className="group">
      <div className="glass-card rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="relative aspect-square">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
            <Heart size={20} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate">{title}</h3>
            <span className="text-primary font-medium">{price} ETH</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>by {creator}</span>
            <span>{likes} likes</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
