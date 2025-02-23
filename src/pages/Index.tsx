
import { memo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types/user";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedPixels } from "@/components/AnimatedPixels";

interface TopCollection extends Collection {
  sold_count: number;
}

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const HotCollection = memo(({ collection, soldCount }: { collection: Collection; soldCount: number }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="glass-card rounded-lg overflow-hidden relative" ref={containerRef}>
      <AnimatedPixels containerRef={containerRef} />
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
              <h2 className="text-3xl font-bold mb-2">{collection.name}</h2>
              <p className="text-muted-foreground">{collection.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-primary">{soldCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-base">{format(new Date(collection.created_at), 'PP')}</p>
              </div>
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
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                🔥 Hot Collection
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
