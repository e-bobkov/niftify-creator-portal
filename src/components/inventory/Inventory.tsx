
import { useState, useEffect } from "react";
import { NFTCard } from "@/components/NFTCard";
import { 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  SortDesc,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  id: string;
  title: string;
  image: string;
  price: number;
  collectionId: string;
  collectionName: string;
  authorId: string;
  authorName: string;
  rarity: "common" | "uncommon" | "rare" | "legendary" | "mythic";
}

// Массив фейковых NFT для примера
const MOCK_NFTS: InventoryItem[] = [
  {
    id: "nft-001",
    title: "Cosmic Guardian",
    image: "https://picsum.photos/seed/nft1/400/400",
    price: 0.5,
    collectionId: "col-001",
    collectionName: "Cosmic Series",
    authorId: "auth-001",
    authorName: "DigitalVisioneer",
    rarity: "rare"
  },
  {
    id: "nft-002",
    title: "Neon Warrior",
    image: "https://picsum.photos/seed/nft2/400/400",
    price: 0.8,
    collectionId: "col-002",
    collectionName: "Cyber Warriors",
    authorId: "auth-002",
    authorName: "NeoCrafter",
    rarity: "uncommon"
  },
  {
    id: "nft-003",
    title: "Ancient Relic",
    image: "https://picsum.photos/seed/nft3/400/400",
    price: 1.2,
    collectionId: "col-001",
    collectionName: "Cosmic Series",
    authorId: "auth-001",
    authorName: "DigitalVisioneer",
    rarity: "legendary"
  },
  {
    id: "nft-004",
    title: "Pixelated Dream",
    image: "https://picsum.photos/seed/nft4/400/400",
    price: 0.3,
    collectionId: "col-003",
    collectionName: "Pixel Universe",
    authorId: "auth-003",
    authorName: "PixelMaster",
    rarity: "common"
  },
  {
    id: "nft-005",
    title: "Golden Artifact",
    image: "https://picsum.photos/seed/nft5/400/400",
    price: 2.5,
    collectionId: "col-004",
    collectionName: "Ancient Collection",
    authorId: "auth-004",
    authorName: "HistoricalArtist",
    rarity: "mythic"
  },
  {
    id: "nft-006",
    title: "Digital Samurai",
    image: "https://picsum.photos/seed/nft6/400/400",
    price: 0.9,
    collectionId: "col-002",
    collectionName: "Cyber Warriors",
    authorId: "auth-002",
    authorName: "NeoCrafter",
    rarity: "rare"
  }
];

// Получить цвет в зависимости от редкости
const getRarityColor = (rarity: InventoryItem["rarity"]) => {
  switch (rarity) {
    case "common": return "bg-gray-400";
    case "uncommon": return "bg-green-500";
    case "rare": return "bg-blue-500";
    case "legendary": return "bg-purple-500";
    case "mythic": return "bg-yellow-400";
    default: return "bg-gray-400";
  }
};

export const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_NFTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<InventoryItem["rarity"] | "all">("all");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "price-high" | "price-low">("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // Фильтрация и сортировка элементов
  useEffect(() => {
    let filteredItems = [...MOCK_NFTS];
    
    // Фильтр по поиску
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.collectionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтр по редкости
    if (activeFilter !== "all") {
      filteredItems = filteredItems.filter(item => item.rarity === activeFilter);
    }
    
    // Сортировка
    switch (sortOption) {
      case "newest":
        filteredItems.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
        break;
      case "oldest":
        filteredItems.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));
        break;
      case "price-high":
        filteredItems.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filteredItems.sort((a, b) => a.price - b.price);
        break;
    }
    
    setItems(filteredItems);
  }, [searchTerm, activeFilter, sortOption]);

  // Фильтры по редкости
  const rarityFilters = [
    { label: "All", value: "all" },
    { label: "Common", value: "common" },
    { label: "Uncommon", value: "uncommon" },
    { label: "Rare", value: "rare" },
    { label: "Legendary", value: "legendary" },
    { label: "Mythic", value: "mythic" }
  ];

  // Опции сортировки
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Price: Low to High", value: "price-low" }
  ];

  // Отображаемые элементы текущей страницы
  const displayedItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Расчет общего количества страниц
  const pageCount = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="w-full">
      <div className="mb-6 relative">
        <div className="glass-card p-6 rounded-2xl backdrop-blur-lg border border-white/10 shadow-xl overflow-hidden">
          {/* Заголовок с 3D эффектом */}
          <div className="mb-8 text-center relative group perspective">
            <div className="transform group-hover:rotate-x-12 transition-transform duration-700">
              <h2 className="text-3xl md:text-4xl font-bold relative z-10 mb-2">
                <span className="bg-gradient-to-r from-[#FF3DB0] to-[#D946EF] bg-clip-text text-transparent">
                  Your NFT Inventory
                </span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Manage your digital collectibles in one place
              </p>
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#FF3DB0] to-[#D946EF] rounded-full blur-md opacity-70"></div>
          </div>

          {/* Инструменты фильтрации и поиска */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-white/10 hover:border-white/20 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="relative group"
              >
                <Filter className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary transform scale-0 group-hover:scale-100 transition-transform"></span>
              </Button>
              
              <div className="flex-1 md:flex-none">
                <select 
                  className="form-select bg-background/50 border border-white/10 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Фильтры по редкости */}
          {isFilterOpen && (
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 animate-fade-in">
              {rarityFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value as any)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all transform hover:scale-105 ${
                    activeFilter === filter.value 
                      ? "bg-primary text-white shadow-lg" 
                      : "bg-background/50 text-foreground hover:bg-background/80"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {/* Статистика инвентаря */}
          <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="glass-card p-3 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-xs text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div className="glass-card p-3 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-xs text-muted-foreground">Collections</p>
              <p className="text-2xl font-bold">{new Set(items.map(item => item.collectionId)).size}</p>
            </div>
            <div className="glass-card p-3 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-xs text-muted-foreground">Highest Value</p>
              <p className="text-2xl font-bold">{items.length > 0 ? `${Math.max(...items.map(i => i.price))} ETH` : '0 ETH'}</p>
            </div>
            <div className="glass-card p-3 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform">
              <p className="text-xs text-muted-foreground">Rarest Item</p>
              <p className="text-2xl font-bold capitalize">
                {items.some(i => i.rarity === 'mythic') ? 'Mythic' : 
                 items.some(i => i.rarity === 'legendary') ? 'Legendary' : 
                 items.some(i => i.rarity === 'rare') ? 'Rare' : 
                 items.some(i => i.rarity === 'uncommon') ? 'Uncommon' : 'Common'}
              </p>
            </div>
          </div>

          {/* Сетка с NFT */}
          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative perspective">
              {displayedItems.map((item, index) => (
                <div key={item.id} className="relative group transform transition-all duration-500 hover:rotate-y-3 hover:scale-[1.02]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur opacity-0 group-hover:opacity-70 transition-opacity"></div>
                  
                  {/* Индикатор редкости */}
                  <div className={`absolute -right-1 -top-1 w-3 h-3 rounded-full ${getRarityColor(item.rarity)} shadow-lg z-10 animate-pulse`}></div>
                  
                  <div className="relative">
                    <NFTCard
                      id={item.id}
                      collectionId={item.collectionId}
                      title={item.title}
                      image={item.image}
                      price={item.price}
                      showBuyButton={false}
                      isMarketplace={false}
                      collectionName={item.collectionName}
                      authorId={item.authorId}
                      authorName={item.authorName}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No items found</h3>
              <p className="text-muted-foreground">Try changing your search or filters</p>
            </div>
          )}

          {/* Навигация по страницам */}
          {pageCount > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === pageCount - 1}
                onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
