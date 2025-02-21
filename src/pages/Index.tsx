
import { Navbar } from "@/components/Navbar";
import { NFTCard } from "@/components/NFTCard";

const FEATURED_NFTS = [
  {
    id: "1",
    title: "Dayco Serpentine Belt",
    image: "/lovable-uploads/d0ea3918-6337-416b-8aed-955c993176e2.png",
    price: 0.34,
    creator: "Cody Fisher",
    likes: 250,
  },
  {
    id: "2",
    title: "Mechanical Dragonfly",
    image: "/lovable-uploads/98ac1d8d-98bf-47ee-803a-e10ad785a7d1.png",
    price: 0.032,
    creator: "Marvin McKinney",
    likes: 208,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="space-y-8 animate-fadeIn">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover, Create & Sell
              <span className="text-primary block mt-2">Digital Art</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The world's first and largest digital marketplace for crypto collectibles and NFTs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_NFTS.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
