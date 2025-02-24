
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Collection } from "@/types/user";
import { HeroSection } from "./home/HeroSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { HotCollection } from "./home/HotCollection";
import { PolygonFeatures } from "./home/PolygonFeatures";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const Index = () => {
  const navigate = useNavigate();
  const {
    data: topCollection,
    isLoading
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

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="space-y-24 animate-fadeIn">
          <HeroSection />
          <FeaturesSection />

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
          ) : null}

          <PolygonFeatures />

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
                    <span className="block mt-2 bg

-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                      Digital Masterpieces
                    </span>
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Don't miss your chance to own unique digital art pieces
                  </p>
                </div>

                <div className="pt-8">
                  <Button 
                    size="lg" 
                    className="text-lg px-10 py-8 bg-primary/90 hover:bg-primary transition-colors duration-300 group relative overflow-hidden"
                    onClick={() => navigate('/marketplace')}
                  >
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
        </section>
      </main>
    </div>
  );
};

export default Index;
