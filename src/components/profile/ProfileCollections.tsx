
import { useAuth } from "@/hooks/useAuth";
import { Collection } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export const ProfileCollections = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
          partner_id: user?.id // Используем ID пользователя
        })
      });

      if (response.status === 401) {
        logout();
        navigate('/auth');
        toast({
          description: (
            <Alert variant="default" className="border-primary bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary">
                Please sign in again to continue.
              </AlertDescription>
            </Alert>
          )
        });
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      return data.collections;
    },
    enabled: !!token && !!user?.id
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
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
  );
};
