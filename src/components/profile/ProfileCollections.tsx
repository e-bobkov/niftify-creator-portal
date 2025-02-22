
import { Collection } from "@/types/user";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCollections } from "@/hooks/useCollections";

export const ProfileCollections = ({ limit }: { limit?: number }) => {
  const navigate = useNavigate();
  const { data: collections, isLoading, error } = useCollections();

  const displayedCollections = limit && collections 
    ? collections
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
    : collections;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(limit || 3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-primary/10 rounded-lg aspect-square mb-2"></div>
            <div className="h-4 bg-primary/10 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-primary/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-5 h-5" />
        <p>Failed to load collections</p>
      </div>
    );
  }

  if (!collections?.length) {
    return (
      <div className="text-muted-foreground text-center p-8">
        No collections yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayedCollections.map((collection) => (
        <div 
          key={collection.id} 
          className="group cursor-pointer" 
          onClick={() => navigate(`/my-collection/${collection.id}`)}
        >
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={collection.image_url}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4 space-y-2">
              <h4 className="font-semibold truncate">{collection.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {collection.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Created: {format(new Date(collection.created_at), 'PP')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
