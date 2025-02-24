
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Collection } from "@/types/user";
import { HeroSection } from "./home/HeroSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { HotCollection } from "./home/HotCollection";
import { PolygonFeatures } from "./home/PolygonFeatures";
import { WhyDigitalArt } from "./home/WhyDigitalArt";
import { CallToAction } from "./home/CallToAction";

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const Index = () => {
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
          <WhyDigitalArt />
          <CallToAction />
        </section>
      </main>
    </div>
  );
};

export default Index;
