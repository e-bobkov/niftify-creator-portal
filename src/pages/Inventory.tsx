
import { useState, useEffect } from "react";
import { Gem, Package } from "lucide-react";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryItem } from "@/components/inventory/InventoryCard";
import { useAuth } from "@/hooks/useAuth";

// Генерация фейковых данных для инвентаря
const generateMockInventory = (count: number): InventoryItem[] => {
  const rarities: InventoryItem["rarity"][] = ["common", "uncommon", "rare", "legendary", "mythic"];
  const collectionNames = ["Cosmic Series", "Cyber Warriors", "Pixel Universe", "Ancient Collection", "Future Relics"];
  const collections = [
    { id: "col-001", name: "Cosmic Series", authorId: "auth-001", authorName: "DigitalVisioneer" },
    { id: "col-002", name: "Cyber Warriors", authorId: "auth-002", authorName: "NeoCrafter" },
    { id: "col-003", name: "Pixel Universe", authorId: "auth-003", authorName: "PixelMaster" },
    { id: "col-004", name: "Ancient Collection", authorId: "auth-004", authorName: "HistoricalArtist" },
    { id: "col-005", name: "Future Relics", authorId: "auth-005", authorName: "FutureThinker" }
  ];

  const getRandomCollection = () => collections[Math.floor(Math.random() * collections.length)];
  
  // Функция для получения случайной даты в последние 6 месяцев
  const getRandomDate = () => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())).toISOString();
  };

  // Функция для получения случайной цены, зависящей от редкости
  const getRandomPrice = (rarity: InventoryItem["rarity"]) => {
    const basePrices = {
      common: 0.01,
      uncommon: 0.05,
      rare: 0.2,
      legendary: 0.8,
      mythic: 3.0
    };
    const basePrice = basePrices[rarity];
    return basePrice + (Math.random() * basePrice);
  };

  return Array.from({ length: count }).map((_, index) => {
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const collection = getRandomCollection();
    const id = `nft-${(index + 1).toString().padStart(3, '0')}`;
    const tokenId = `token-${(index + 1).toString().padStart(3, '0')}`;
    
    return {
      id,
      title: `${["Mystic", "Digital", "Crypto", "Neo", "Ethereal"][Math.floor(Math.random() * 5)]} ${["Artifact", "Guardian", "Voyager", "Fragment", "Totem"][Math.floor(Math.random() * 5)]}`,
      image: `https://picsum.photos/seed/${id}/400/400`,
      price: getRandomPrice(rarity),
      collectionId: collection.id,
      collectionName: collection.name,
      authorId: collection.authorId,
      authorName: collection.authorName,
      tokenId,
      rarity,
      acquiredAt: getRandomDate()
    };
  });
};

const Inventory = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Имитация загрузки данных
    const loadData = async () => {
      setIsLoading(true);
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Генерируем фейковые данные
      const mockData = generateMockInventory(16);
      setInventoryItems(mockData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="space-y-8 animate-fade-in">
        {/* Заголовок с 3D эффектом */}
        <div className="text-center relative perspective">
          <div className="absolute -top-4 left-0 right-0 h-40 bg-primary/5 rounded-full blur-3xl opacity-70"></div>
          <div className="relative z-10 transform hover:rotate-x-2 transition-transform duration-700 cursor-default">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Package className="h-8 w-8 text-primary animate-float" />
              <h1 className="text-4xl font-bold">Your Inventory</h1>
              <Gem className="h-8 w-8 text-primary animate-float [animation-delay:1s]" />
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse your collection of digital assets, filter by rarity, and track your valuable NFTs
            </p>
          </div>
        </div>
        
        <div className="glass-card p-6 md:p-8 rounded-xl">
          <InventoryGrid items={inventoryItems} isLoading={isLoading} />
        </div>
        
        <div className="glass-card p-6 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Expand Your Collection</h2>
          <p className="text-muted-foreground mb-6">
            Discover new digital treasures to add to your inventory
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/marketplace'} 
              className="bg-primary/90 hover:bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H21M7 3V5M17 3V5M6 12H10V16H6V12ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.07989 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Browse Marketplace
            </button>
            <button 
              onClick={() => window.location.href = '/create'} 
              className="bg-secondary/80 hover:bg-secondary text-secondary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
