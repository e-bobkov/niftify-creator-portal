
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types/user";
import { format } from "date-fns";
import { ExternalLink, TrendingUp, Users, CircleDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopCollection extends Collection {
  sold_count: number;
}

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const HotCollection = memo(({ collection, soldCount }: { collection: Collection; soldCount: number }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Статистика слева */}
      <div className="lg:col-span-3 grid grid-cols-1 gap-6">
        <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">{soldCount}</p>
          <p className="text-sm text-muted-foreground">Total Sales</p>
        </div>
        
        <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">
            {format(new Date(collection.created_at), 'MMM dd')}
          </p>
          <p className="text-sm text-muted-foreground">Created</p>
        </div>
        
        <div className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <CircleDollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">{(soldCount * 0.1).toFixed(1)}K</p>
          <p className="text-sm text-muted-foreground">Volume</p>
        </div>
      </div>

      {/* Карточка коллекции */}
      <div className="lg:col-span-9">
        <div className="glass-card rounded-lg overflow-hidden transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img 
                src={collection.image_url} 
                alt={collection.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-muted-foreground">{collection.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={`https://polygonscan.com/address/${collection.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-2"
                >
                  View on PolygonScan
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/my-collection/${collection.id}`)}
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HotCollection.displayName = 'HotCollection';

const Index = () => {
  const { data: topCollection, isLoading } = useQuery<TopCollectionResponse>({
    queryKey: ['top-collection'],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/collections/top');
      if (!response.ok) {
        throw new Error('Failed to fetch top collection');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="space-y-12 animate-fadeIn">
          <div className="text-center space-y-4 animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover, Create & Sell
              <span className="text-primary block mt-2 animate-scale">Digital Art</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The world's first and largest digital marketplace for crypto collectibles and NFTs.
            </p>
          </div>

          {isLoading ? (
            <div className="glass-card rounded-lg p-8 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-primary/10 rounded-lg" />
                <div className="space-y-4">
                  <div className="h-8 bg-primary/10 rounded w-3/4" />
                  <div className="h-20 bg-primary/10 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-primary/10 rounded" />
                    <div className="h-16 bg-primary/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ) : topCollection ? (
            <div className="space-y-8">
              <h2 className="text-[8rem] font-bold text-center leading-none tracking-tighter">
                <span className="text-muted-foreground">#</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                  HOT COLLECTION
                </span>
              </h2>
              <HotCollection 
                collection={topCollection.collection} 
                soldCount={topCollection.sold_count} 
              />
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default Index;
