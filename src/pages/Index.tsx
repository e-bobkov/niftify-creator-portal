
import { memo, Suspense, lazy } from "react";
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

// Мемоизированные базовые компоненты
const PlatformFeature = memo(({
  icon: Icon,
  title,
  description
}: {
  icon: typeof Palette;
  title: string;
  description: string;
}) => (
  <div className="glass-card p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
));

PlatformFeature.displayName = 'PlatformFeature';

const PolygonFeature = memo(({
  icon: Icon,
  title,
  description,
  gradient
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  gradient: string;
}) => (
  <div className="glass-card p-6 relative overflow-hidden group">
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
  </div>
));

PolygonFeature.displayName = 'PolygonFeature';

// Разделение секций на отдельные компоненты для лучшей производительности
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
  );
});

HeroSection.displayName = 'HeroSection';

// Ленивая загрузка тяжелых секций
const DigitalArtBenefits = lazy(() => import('./sections/DigitalArtBenefits'));
const MarketplaceCallToAction = lazy(() => import('./sections/MarketplaceCallToAction'));
const PolygonSection = lazy(() => import('./sections/PolygonSection'));

// Оптимизированный основной компонент
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
    staleTime: 1000 * 60 * 5 // 5 minutes
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
            <HotCollection collection={topCollection.collection} soldCount={topCollection.sold_count} />
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
