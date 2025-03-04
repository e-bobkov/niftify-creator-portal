import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types/user";
import { format } from "date-fns";
import { ExternalLink, TrendingUp, Users, CircleDollarSign, Palette, DollarSign, Rocket, Sparkles, Shield, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopCollection extends Collection {
  sold_count: number;
}

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const PlatformFeature = ({
  icon: Icon,
  title,
  description
}: {
  icon: typeof Palette;
  title: string;
  description: string;
}) => <div className="glass-card p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>;

const PolygonFeature = ({
  icon: Icon,
  title,
  description,
  gradient
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  gradient: string;
}) => <div className="glass-card p-6 relative overflow-hidden group">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className={`w-full h-full ${gradient} opacity-10`} />
    </div>
    <div className="relative z-10">
      <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </div>;

const HotCollection = memo(({
  collection,
  soldCount
}: {
  collection: Collection;
  soldCount: number;
}) => {
  const navigate = useNavigate();
  return <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
              <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{collection.name}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <a href={`https://polygonscan.com/address/${collection.contract_address}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                  View on PolygonScan
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button className="w-full" onClick={() => navigate(`/my-collection/${collection.id}`)}>
                  Explore Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
});

HotCollection.displayName = 'HotCollection';

const Index = () => {
  const navigate = useNavigate();
  const {
    data: topCollection,
    isLoading,
    isError
  } = useQuery<TopCollectionResponse>({
    queryKey: ['top-collection'],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/collections/top');
      if (!response.ok) {
        throw new Error('Failed to fetch top collection');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  return <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="space-y-24 animate-fadeIn">
          <div className="text-center space-y-12">
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
                For the sake
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent my-0 py-[10px]">
                  of art
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed py-0">
                Transform your digital creations into valuable assets
              </p>

              <div className="pt-6">
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/create')}>
                  <Sparkles className="mr-2" />
                  Start Creating Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="transform hover:scale-105 transition-all duration-300 relative">
                <div className="glass-card p-8 text-center">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                  <Palette className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
                  <h3 className="text-xl font-bold mb-2 relative z-10">Create</h3>
                  <p className="text-muted-foreground relative z-10">Turn your digital art into unique NFT collections</p>
                </div>
              </div>
              
              <div className="md:translate-y-12 transform hover:scale-105 transition-all duration-300">
                <div className="glass-card p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
                  <h3 className="text-xl font-bold mb-2 relative z-10">Monetize</h3>
                  <p className="text-muted-foreground relative z-10">Sell your art and earn real money</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="glass-card p-8 text-center transform group-hover:scale-105 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <Rocket className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Launch</h3>
                  <p className="text-muted-foreground">Join the digital art revolution</p>
                </div>
              </div>
            </div>
          </div>

          {!isError && topCollection && (
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-bold text-center leading-none tracking-tighter transition-all duration-300">
                <span className="text-muted-foreground">#</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                  HOT COLLECTION
                </span>
              </h2>
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-primary/50 rounded-full hidden md:block" />
                <div className="space-y-4 md:pl-8">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Featured Collection
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
                    Discover our most popular and trending digital art collection, showcasing exceptional creativity and innovation in the NFT space.
                  </p>
                </div>
              </div>
              <HotCollection collection={topCollection.collection} soldCount={topCollection.sold_count} />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl" />
            <div className="glass-card rounded-3xl p-12 md:p-16 lg:p-20 relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block relative">
                  <div className="absolute inset-0 animate-pulse bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative">
                    <svg viewBox="0 0 24 24" className="w-24 h-24 md:w-32 md:h-32 mx-auto text-primary transform -rotate-12 group-hover:rotate-12 transition-transform duration-700">
                      <path fill="currentColor" d="M2.252 19.721c-.36-.36-.36-.945 0-1.305L9.797 10.5 2.252 2.584c-.36-.36-.36-.945 0-1.305.36-.36.945-.36 1.305 0L12 9.194l8.443-7.915c.36-.36.945-.36 1.305 0 .36.36.36.945 0 1.305L14.203 10.5l7.545 7.916c.36.36.36.945 0 1.305-.36.36-.945.36-1.305 0L12 11.806l-8.443 7.915c-.36.36-.945.36-1.305 0z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
                    Time to Collect
                    <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                      Digital Masterpieces
                    </span>
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Don't miss your chance to own unique digital art pieces
                  </p>
                </div>

                <div className="pt-8">
                  <Button size="lg" className="text-lg px-10 py-8 bg-primary/90 hover:bg-primary transition-colors duration-300 group relative overflow-hidden" onClick={() => navigate('/marketplace')}>
                    <span className="relative z-10 flex items-center gap-3">
                      Explore Marketplace
                      <ExternalLink className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-4">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">Why Polygon?</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                The Future of NFTs on
                <span className="relative inline-block ml-3 group">
                  <span className="absolute -inset-1 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300" />
                  <span className="relative">Polygon</span>
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We've chosen Polygon as our mainnet for its exceptional benefits and features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PolygonFeature icon={Shield} title="Security First" description="Built on Ethereum's security model with additional layers of protection for your NFTs" gradient="bg-gradient-to-br from-green-500/20 to-blue-500/20" />
              <PolygonFeature icon={Rocket} title="Lightning Speed" description="Near-instant transactions and confirmations for seamless minting and trading" gradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
              <PolygonFeature icon={CircleDollarSign} title="Low Gas Fees" description="Minimal transaction costs make creating and trading NFTs accessible to everyone" gradient="bg-gradient-to-br from-yellow-500/20 to-red-500/20" />
              <PolygonFeature icon={Globe} title="Global Scale" description="Infrastructure capable of handling millions of transactions with ease" gradient="bg-gradient-to-br from-blue-500/20 to-indigo-500/20" />
            </div>

            <div className="flex justify-center pt-8">
              <a href="https://polygon.technology" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                Learn more about Polygon
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-x-4 inset-y-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-[2rem] blur-3xl" />
            <div className="glass-card rounded-3xl p-12 md:p-16 lg:p-20 relative overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-none">
                    Why Digital Art is the
                    <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                      Future of Collecting
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                    <div className="glass-card p-8 relative space-y-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 transform -rotate-6 group-hover:rotate-6 transition-transform duration-300">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Authenticity</h3>
                      <p className="leading-relaxed font-normal text-gray-100">
                        Each piece is unique and verifiable on the blockchain, ensuring genuine ownership and provenance.
                      </p>
                    </div>
                  </div>

                  <div className="group relative md:translate-y-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                    <div className="glass-card p-8 relative space-y-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 transform rotate-6 group-hover:-rotate-6 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Investment Potential</h3>
                      <p className="leading-relaxed text-gray-100">
                        Digital art market is growing exponentially, offering significant returns on investment.
                      </p>
                    </div>
                  </div>

                  <div className="group relative lg:translate-y-16">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                    <div className="glass-card p-8 relative space-y-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 transform -rotate-3 group-hover:rotate-3 transition-transform duration-300">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">Community</h3>
                      <p className="leading-relaxed text-gray-100">
                        Join a thriving community of collectors, artists, and enthusiasts sharing the same passion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-20 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-2xl" />
                  <div className="relative glass-card rounded-2xl p-8 md:p-12 text-center transform hover:scale-[1.02] transition-transform duration-300">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">
                      Ready to Start Your Collection?
                    </h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                      Experience the future of art ownership with our curated digital masterpieces
                    </p>
                    <Button size="lg" className="text-lg px-12 py-6 bg-primary/90 hover:bg-primary transition-all duration-300 shadow-xl hover:shadow-primary/20" onClick={() => navigate('/marketplace')}>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Start Collecting
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>;
};

export default Index;
