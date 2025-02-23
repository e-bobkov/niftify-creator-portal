
import { memo, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { Collection } from "@/types/user";
import HeroSection from "@/components/home/HeroSection";
import TopCollectionSection from "@/components/home/TopCollectionSection";

// Ленивая загрузка тяжелых секций
const PolygonFeature = lazy(() => import("@/components/home/PolygonFeature"));
const DigitalArtSection = lazy(() => import("@/components/home/DigitalArtSection"));
const MarketplaceSection = lazy(() => import("@/components/home/MarketplaceSection"));

interface TopCollectionResponse {
  collection: Collection;
  sold_count: number;
}

const LoadingCollection = () => (
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
);

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
    retry: 1 // Уменьшаем количество повторных попыток
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="space-y-24">
          {/* Hero секция загружается сразу */}
          <HeroSection />

          {/* Условный рендеринг для коллекции */}
          {isLoading ? (
            <LoadingCollection />
          ) : topCollection ? (
            <TopCollectionSection
              collection={topCollection.collection}
              soldCount={topCollection.sold_count}
            />
          ) : null}

          {/* Ленивая загрузка остальных секций */}
          <Suspense fallback={<div className="h-96 glass-card rounded-lg animate-pulse" />}>
            <MarketplaceSection />
          </Suspense>

          <Suspense fallback={<div className="h-[32rem] glass-card rounded-lg animate-pulse" />}>
            <DigitalArtSection />
          </Suspense>

          <Suspense fallback={<div className="h-96 glass-card rounded-lg animate-pulse" />}>
            <PolygonFeature />
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default memo(Index);
