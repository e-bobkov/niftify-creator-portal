
import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  DollarSign, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { NFTCard } from "@/components/NFTCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { TransactionTicker } from "@/components/explore/TransactionTicker";
import { ExploreBackground } from "@/components/explore/ExploreBackground";
import { FilterBadge } from "@/components/explore/FilterBadge";
import { 
  useMarketplaceCollections, 
  useAllMarketplaceTokens, 
  useMarketplaceCollectionTokens 
} from "@/hooks/useMarketplace";
import { MarketplaceToken } from "@/api/marketplace";
import { useNavigate, useParams } from "react-router-dom";

const TOKENS_PER_PAGE = 16;

const Marketplace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Получаем коллекции
  const { 
    data: collections, 
    isLoading: isLoadingCollections, 
    error: collectionsError 
  } = useMarketplaceCollections();

  // Получаем токены выбранной коллекции
  const { 
    data: collectionTokens, 
    isLoading: isLoadingCollectionTokens,
    prefetchTokens
  } = useMarketplaceCollectionTokens(selectedCollection);

  // Получаем все токены со всех коллекций, если ни одна не выбрана
  const { 
    data: allTokensData, 
    isLoading: isLoadingAllTokens, 
    error: allTokensError 
  } = useAllMarketplaceTokens();

  // Обрабатываем ошибки
  useEffect(() => {
    if (collectionsError || allTokensError) {
      toast({
        title: "Error",
        description: "Failed to load marketplace data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [collectionsError, allTokensError, toast]);

  // Получаем все токены из всех коллекций, если конкретная коллекция не выбрана
  const allTokens: MarketplaceToken[] = useMemo(() => {
    if (!allTokensData) return [];
    
    return Object.values(allTokensData).flat();
  }, [allTokensData]);

  // Определяем, какие токены отображать в зависимости от того, выбрана ли коллекция
  const tokensToDisplay = useMemo(() => {
    return selectedCollection ? collectionTokens || [] : allTokens;
  }, [selectedCollection, collectionTokens, allTokens]);

  // Применяем фильтры к токенам
  const filteredTokens = useMemo(() => {
    return tokensToDisplay.filter(token => {
      const matchesSearch = token.metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesPrice = !token.price || (token.price >= priceRange[0] && token.price <= priceRange[1]);
      const matchesDate = !selectedDate || 
        (token.minted_at && format(new Date(token.minted_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));

      return matchesSearch && matchesPrice && matchesDate;
    });
  }, [tokensToDisplay, searchQuery, priceRange, selectedDate]);

  // Пагинация токенов
  const paginatedTokens = useMemo(() => {
    const startIndex = (currentPage - 1) * TOKENS_PER_PAGE;
    return filteredTokens.slice(startIndex, startIndex + TOKENS_PER_PAGE);
  }, [filteredTokens, currentPage]);

  const totalPages = Math.ceil(filteredTokens.length / TOKENS_PER_PAGE);

  // Функция для удаления фильтра
  const removeFilter = useCallback((filter: string) => {
    switch (filter) {
      case 'collection':
        setSelectedCollection("");
        break;
      case 'date':
        setSelectedDate(undefined);
        break;
      case 'price':
        setPriceRange([0, 1000]);
        break;
      default:
        break;
    }
    setActiveFilters(filters => filters.filter(f => f !== filter));
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  }, []);

  // Функция для изменения выбранной коллекции
  const handleCollectionChange = useCallback((collectionId: string) => {
    setSelectedCollection(collectionId);
    setActiveFilters(prev => [...new Set([...prev, 'collection'])]);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене коллекции
    
    // Предварительно загружаем токены для выбранной коллекции
    prefetchTokens(collectionId);
  }, [prefetchTokens]);

  // Предварительно загружаем данные для пагинации
  const prefetchNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      // Здесь нет необходимости делать дополнительные запросы, так как у нас уже есть все данные
      // Мы просто готовимся к следующей странице
      console.log(`Preparing for page ${currentPage + 1}`);
    }
  }, [currentPage, totalPages]);

  // Предварительно загружаем данные для предыдущей страницы
  const prefetchPrevPage = useCallback(() => {
    if (currentPage > 1) {
      // Здесь нет необходимости делать дополнительные запросы, так как у нас уже есть все данные
      // Мы просто готовимся к предыдущей странице
      console.log(`Preparing for page ${currentPage - 1}`);
    }
  }, [currentPage]);

  // Вызываем предварительную загрузку при изменении текущей страницы
  useEffect(() => {
    prefetchNextPage();
    prefetchPrevPage();
  }, [currentPage, prefetchNextPage, prefetchPrevPage]);

  // Считаем, загружаются ли данные
  const isLoading = isLoadingCollections || isLoadingAllTokens || isLoadingCollectionTokens;

  // Определяем видимые страницы для пагинации
  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let pages = [];
    
    // Всегда показываем первую страницу
    pages.push(1);
    
    // Определяем диапазон страниц вокруг текущей
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Добавляем разделитель перед диапазоном, если нужно
    if (startPage > 2) {
      pages.push(-1); // -1 обозначает разделитель "..."
    }
    
    // Добавляем страницы в диапазоне
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Добавляем разделитель после диапазона, если нужно
    if (endPage < totalPages - 1) {
      pages.push(-2); // -2 обозначает другой разделитель "..."
    }
    
    // Всегда показываем последнюю страницу
    pages.push(totalPages);
    
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ExploreBackground />
      
      <TransactionTicker />

      <div className="container mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search NFTs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Сбрасываем на первую страницу при изменении поиска
                }}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Collection
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <ScrollArea className="h-72">
                    {isLoadingCollections ? (
                      <div className="space-y-2 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-10 bg-primary/10 rounded-md" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {collections?.map((collection) => (
                          <Button
                            key={collection.id}
                            variant="ghost"
                            className={`w-full justify-start ${selectedCollection === collection.id ? 'bg-primary/20' : ''}`}
                            onClick={() => handleCollectionChange(collection.id)}
                          >
                            {collection.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Range: ${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <Slider
                      min={0}
                      max={1000}
                      step={50}
                      value={priceRange}
                      onValueChange={(value) => {
                        setPriceRange(value);
                        setActiveFilters(prev => [...new Set([...prev, 'price'])]);
                        setCurrentPage(1); // Сбрасываем на первую страницу при изменении цены
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setActiveFilters(prev => [...new Set([...prev, 'date'])]);
                      setCurrentPage(1); // Сбрасываем на первую страницу при изменении даты
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              {activeFilters.includes('collection') && (
                <FilterBadge
                  filter="collection"
                  value={collections?.find(c => c.id === selectedCollection)?.name || ''}
                  onRemove={() => removeFilter('collection')}
                />
              )}
              {activeFilters.includes('price') && (
                <FilterBadge
                  filter="price"
                  value={`$${priceRange[0]} - $${priceRange[1]}`}
                  onRemove={() => removeFilter('price')}
                />
              )}
              {activeFilters.includes('date') && (
                <FilterBadge
                  filter="date"
                  value={selectedDate ? format(selectedDate, 'PP') : ''}
                  onRemove={() => removeFilter('date')}
                />
              )}
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-primary/10 rounded-lg">
                    <div className="aspect-square"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-primary/5 rounded w-2/3"></div>
                      <div className="h-4 bg-primary/5 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredTokens.length === 0 ? (
                <div className="text-center p-10 glass-card rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No tokens found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence>
                    {paginatedTokens.map((token) => (
                      <motion.div
                        key={`${token.collection_id}-${token.token_id}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <NFTCard
                          id={token.id !== undefined ? token.id.toString() : `${token.collection_id}-${token.token_id}`}
                          collectionId={token.collection_id}
                          title={token.metadata?.name || `Token #${token.token_id}`}
                          image={token.metadata?.image || "/placeholder.svg"}
                          price={token.price || 0}
                          soldAt={token.sold_at}
                          showBuyButton={!token.sold_at}
                          isMarketplace={true}
                          onExplore={() => {
                            navigate(`/marketplace/${token.id}`);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {filteredTokens.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    onMouseEnter={prefetchPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {visiblePages.map((pageNum, i) => {
                      if (pageNum < 0) {
                        // Отображаем разделитель
                        return <span key={`ellipsis-${i}`} className="px-2">...</span>;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    onMouseEnter={prefetchNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Marketplace;
