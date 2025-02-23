import { memo, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types/user";
import { Palette, DollarSign, Rocket, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HotCollection from "@/components/home/HotCollection";
import FeatureCard from "@/components/home/FeatureCard";

// Ленивая загрузка тяжелых секций
const PolygonSection = lazy(() => import('@/components/home/sections/PolygonSection'));
const DigitalArtBenefits = lazy(() => import('@/components/home/sections/DigitalArtBenefits'));
const MarketplaceCallToAction = lazy(() => import('@/components/home/sections/MarketplaceCallToAction'));

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

// Мемоизированные компоненты
const HeroSection = memo(() => {
  const navigate = useNavigate();
  
  return (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Palette}
          title="Create"
          description="Turn your digital art into unique NFT collections"
        />
        
        <FeatureCard
          icon={DollarSign}
          title="Monetize"
          description="Sell your art and earn real money"
          className="md:translate-y-12"
          gradientFrom="from-purple-600"
          gradientTo="to-blue-600"
        />
        
        <FeatureCard
          icon={Rocket}
          title="Launch"
          description="Join the digital art revolution"
          gradientFrom="from-blue-600"
          gradientTo="to-green-600"
        />
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

// Основной компонент с оптимизациями
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
    staleTime: 1000 * 60 * 5, // 5 минут кэширования
    gcTime: 1000 * 60 * 30, // 30 минут хранения в памяти
    retry: 1, // Уменьшаем количество повторных попыток
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="space-y-24">
          <HeroSection />

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
            <HotCollection 
              collection={topCollection.collection} 
              soldCount={topCollection.sold_count} 
            />
          ) : null}

          <Suspense fallback={<div className="h-96 glass-card rounded-lg animate-pulse" />}>
            <MarketplaceCallToAction />
          </Suspense>

          <Suspense fallback={<div className="h-[32rem] glass-card rounded-lg animate-pulse" />}>
            <DigitalArtBenefits />
          </Suspense>

          <Suspense fallback={<div className="h-96 glass-card rounded-lg animate-pulse" />}>
            <PolygonSection />
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default memo(Index);
