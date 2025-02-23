import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types/user";
import { format } from "date-fns";
import { ExternalLink, TrendingUp, Users, CircleDollarSign, Palette, DollarSign, Rocket, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopCollection extends Collection {
  sold_count: number;
}

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const PlatformFeature = ({ icon: Icon, title, description }: { 
  icon: typeof Palette, 
  title: string, 
  description: string 
}) => (
  <div className="glass-card p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const HotCollection = memo(({ collection, soldCount }: { collection: Collection; soldCount: number }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
  const navigate = useNavigate();
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
        <section className="space-y-24 animate-fadeIn">
          <div className="text-center space-y-12">
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
                Future of
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                  Digital Art
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your digital creations into valuable assets
              </p>

              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/create')}
                >
                  <Sparkles className="mr-2" />
                  Start Creating Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <PlatformFeature 
                icon={Palette}
                title="Create"
                description="Turn your digital art into unique NFT collections"
              />
              
              <PlatformFeature 
                icon={DollarSign}
                title="Monetize"
                description="Sell your art and earn real money"
              />
              
              <PlatformFeature 
                icon={Rocket}
                title="Launch"
                description="Join the digital art revolution"
              />
            </div>
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
