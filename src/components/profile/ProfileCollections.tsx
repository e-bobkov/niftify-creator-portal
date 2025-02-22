
import { useAuth } from "@/hooks/useAuth";
import { Collection } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

export const ProfileCollections = () => {
  const { token } = useAuth();

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await fetch('https://test.ftsoa.art/profile/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          partner_id: token // Используем token как partner_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      return data.collections;
    },
    enabled: !!token
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="font-semibold mb-4">My Collections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-primary/10 rounded-lg aspect-square mb-2"></div>
              <div className="h-4 bg-primary/10 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-primary/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load collections</p>
        </div>
      </div>
    );
  }

  if (!collections?.length) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="font-semibold mb-4">My Collections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-muted-foreground text-center p-8">
            No collections yet
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="font-semibold mb-4">My Collections</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div key={collection.id} className="group">
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
    </div>
  );
};
