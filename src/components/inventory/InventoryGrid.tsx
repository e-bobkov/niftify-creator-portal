
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  RefreshCw, 
  Search,
  SortAsc,
  Package,
  ShieldAlert,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryCard, InventoryItem } from "./InventoryCard";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { formatPrice } from "@/utils/format";

interface InventoryGridProps {
  items: InventoryItem[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 8;

// Конфигурация для стилизации на основе редкости
const rarityConfig = {
  common: {
    color: "bg-slate-400",
    label: "Common",
    borderGlow: "group-hover:shadow-slate-500/30"
  },
  uncommon: {
    color: "bg-green-500",
    label: "Uncommon",
    borderGlow: "group-hover:shadow-green-500/30"
  },
  rare: {
    color: "bg-blue-500",
    label: "Rare",
    borderGlow: "group-hover:shadow-blue-500/30"
  },
  legendary: {
    color: "bg-purple-500",
    label: "Legendary",
    borderGlow: "group-hover:shadow-purple-500/30"
  },
  mythic: {
    color: "bg-yellow-400",
    label: "Mythic",
    borderGlow: "group-hover:shadow-yellow-400/30"
  }
};

export const InventoryGrid = ({ items, isLoading = false }: InventoryGridProps) => {
  const navigate = useNavigate(); // Добавляем хук useNavigate
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<InventoryItem["rarity"] | "all">("all");
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "price-high" | "price-low" | "rarity">("newest");
  const [activeTab, setActiveTab] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Фильтрация и сортировка элементов
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];
    
    // Фильтр по поиску
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.collectionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтр по редкости
    if (activeFilter !== "all") {
      result = result.filter(item => item.rarity === activeFilter);
    }
    
    // Рейтинг редкости для сортировки
    const rarityRank = {
      "common": 1,
      "uncommon": 2,
      "rare": 3,
      "legendary": 4,
      "mythic": 5
    };
    
    // Сортировка
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.acquiredAt).getTime() - new Date(b.acquiredAt).getTime());
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "rarity":
        result.sort((a, b) => rarityRank[b.rarity] - rarityRank[a.rarity]);
        break;
    }
    
    return result;
  }, [items, searchTerm, activeFilter, sortOption]);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, sortOption]);

  // Расчет пагинации
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Компонент статистики инвентаря
  const InventoryStats = () => {
    // Расчет стоимости всего инвентаря
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    // Количество предметов по редкости
    const rarityCount = items.reduce((acc, item) => {
      acc[item.rarity] = (acc[item.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 rounded-lg animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">Total Items</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{items.length}</p>
            <Package className="text-primary h-5 w-5" />
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg animate-fade-in [animation-delay:100ms]">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</p>
            <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1.75L5.75 12.25L12 16L18.25 12.25L12 1.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.75 13.5L12 17.25L18.25 13.5L12 22.25L5.75 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg animate-fade-in [animation-delay:200ms]">
          <p className="text-sm text-muted-foreground mb-1">Rarest Item</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold capitalize">
              {items.some(i => i.rarity === 'mythic') ? 'Mythic' : 
               items.some(i => i.rarity === 'legendary') ? 'Legendary' : 
               items.some(i => i.rarity === 'rare') ? 'Rare' : 
               items.some(i => i.rarity === 'uncommon') ? 'Uncommon' : 'Common'}
            </p>
            <ShieldAlert className="text-yellow-400 h-5 w-5" />
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg animate-fade-in [animation-delay:300ms]">
          <p className="text-sm text-muted-foreground mb-1">Collections</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              {new Set(items.map(item => item.collectionId)).size}
            </p>
            <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 9.75H20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.75 14.25H20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.75 4.5H20.25C21.0784 4.5 21.75 5.17157 21.75 6V18C21.75 18.8284 21.0784 19.5 20.25 19.5H3.75C2.92157 19.5 2.25 18.8284 2.25 18V6C2.25 5.17157 2.92157 4.5 3.75 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    );
  };

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
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Rarity", value: "rarity" }
  ];

  // Рендеринг содержимого грид-вида
  const renderGridContent = () => {
    if (isLoading) {
      return <SkeletonCard count={8} aspectRatio="square" />;
    }
    
    if (filteredAndSortedItems.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {visibleItems.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-12 glass-card rounded-lg">
        <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-semibold">No items found</h3>
        <p className="text-muted-foreground">Try changing your search or filters</p>
      </div>
    );
  };
  
  // Рендеринг содержимого списочного вида
  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse glass-card rounded-lg p-4 flex items-center gap-4">
              <div className="bg-primary/10 h-16 w-16 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary/10 rounded w-1/3"></div>
                <div className="h-3 bg-primary/10 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-24 bg-primary/10 rounded"></div>
            </div>
          ))}
        </div>
      );
    }
    
    if (filteredAndSortedItems.length > 0) {
      return (
        <div className="space-y-2">
          {visibleItems.map((item) => (
            <div 
              key={item.id} 
              className="glass-card rounded-lg p-3 flex items-center gap-4 hover:bg-secondary/10 transition-colors cursor-pointer group"
              onClick={() => navigate(`/my-collection/${item.collectionId}/${item.id}`)}
            >
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${rarityConfig[item.rarity].color}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  From <span className="text-primary">{item.collectionName}</span> • Acquired {new Date(item.acquiredAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                <p className="text-xs flex items-center justify-end">
                  <span className={`inline-block h-2 w-2 rounded-full ${rarityConfig[item.rarity].color} mr-1`}></span>
                  {rarityConfig[item.rarity].label}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-12 glass-card rounded-lg">
        <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-semibold">No items found</h3>
        <p className="text-muted-foreground">Try changing your search or filters</p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        <InventoryStats />
        
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items, collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters {showFilters ? '▲' : '▼'}
            </Button>
            
            <div className="flex-1 sm:flex-none">
              <select 
                className="form-select bg-background/50 border border-input rounded-md px-3 py-2 h-9 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="hidden sm:flex">
              <TabsList className="grid grid-cols-2 w-auto">
                <TabsTrigger value="grid" className="px-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 5.25H10.25V10.25H3.75V5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.75 5.25H20.25V10.25H13.75V5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.75 13.75H10.25V18.75H3.75V13.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.75 13.75H20.25V18.75H13.75V13.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 19H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 19H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
                setSortOption("newest");
              }}
              className="h-9"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        {/* Фильтры */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 animate-fade-in">
            {rarityFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value as any)}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all transform hover:scale-105 ${
                  activeFilter === filter.value 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "bg-background/50 hover:bg-background/80"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Мобильные табы */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="sm:hidden mb-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {renderGridContent()}
          </TabsContent>
          <TabsContent value="list" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {renderListContent()}
          </TabsContent>
        </Tabs>
        
        {/* Десктопные табы */}
        <Tabs value={activeTab} className="hidden sm:block">
          <TabsContent value="grid" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {renderGridContent()}
          </TabsContent>
          <TabsContent value="list" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {renderListContent()}
          </TabsContent>
        </Tabs>
        
        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Логика для отображения пагинации с многоточием
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i < 4 ? i + 1 : totalPages;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = i < 1 ? 1 : totalPages - 4 + i;
                } else {
                  pageToShow = i === 0 ? 1 : i === 4 ? totalPages : currentPage - 1 + i;
                }
                
                // Отображаем многоточие
                if ((totalPages > 5) && ((i === 3 && currentPage < totalPages - 2) || (i === 1 && currentPage > 3))) {
                  return (
                    <span key={`ellipsis-${i}`} className="w-8 text-center">...</span>
                  );
                }
                
                return (
                  <Button
                    key={pageToShow}
                    variant={currentPage === pageToShow ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(pageToShow)}
                  >
                    {pageToShow}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
