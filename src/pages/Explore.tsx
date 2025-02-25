
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  DollarSign, 
  Filter, 
  Grid, 
  SlidersHorizontal, 
  Users,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { NFTCard } from "@/components/NFTCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionTicker } from "@/components/explore/TransactionTicker";
import { ExploreBackground } from "@/components/explore/ExploreBackground";
import { FilterBadge } from "@/components/explore/FilterBadge";

const mockCollections = [
  { id: "1", name: "Cyber Punks" },
  { id: "2", name: "Art Blocks" },
  { id: "3", name: "Doodles" },
  { id: "4", name: "Cool Cats" },
];

const mockCreators = [
  { id: "1", name: "Alex Thompson" },
  { id: "2", name: "Maria Garcia" },
  { id: "3", name: "John Smith" },
  { id: "4", name: "Sarah Wilson" },
];

const mockNFTs = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  collectionId: mockCollections[i % 4].id,
  title: `NFT #${i + 1}`,
  image: `/placeholder.svg`,
  price: Math.floor(Math.random() * 10 + 0.1) * 100,
  creator: mockCreators[i % 4],
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
}));

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredNFTs = useMemo(() => {
    return mockNFTs.filter(nft => {
      const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCollection = !selectedCollection || nft.collectionId === selectedCollection;
      const matchesCreator = !selectedCreator || nft.creator.id === selectedCreator;
      const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1];
      const matchesDate = !selectedDate || format(nft.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

      return matchesSearch && matchesCollection && matchesCreator && matchesPrice && matchesDate;
    });
  }, [searchQuery, selectedCollection, selectedCreator, priceRange, selectedDate]);

  const removeFilter = (filter: string) => {
    switch (filter) {
      case 'collection':
        setSelectedCollection("");
        break;
      case 'creator':
        setSelectedCreator("");
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
  };

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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    <div className="space-y-2">
                      {mockCollections.map((collection) => (
                        <Button
                          key={collection.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setSelectedCollection(collection.id);
                            setActiveFilters(prev => [...new Set([...prev, 'collection'])]);
                          }}
                        >
                          {collection.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    Creator
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <ScrollArea className="h-72">
                    <div className="space-y-2">
                      {mockCreators.map((creator) => (
                        <Button
                          key={creator.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setSelectedCreator(creator.id);
                            setActiveFilters(prev => [...new Set([...prev, 'creator'])]);
                          }}
                        >
                          {creator.name}
                        </Button>
                      ))}
                    </div>
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
              {activeFilters.map((filter) => (
                <FilterBadge
                  key={filter}
                  filter={filter}
                  value={
                    filter === 'collection' ? mockCollections.find(c => c.id === selectedCollection)?.name :
                    filter === 'creator' ? mockCreators.find(c => c.id === selectedCreator)?.name :
                    filter === 'price' ? `$${priceRange[0]} - $${priceRange[1]}` :
                    filter === 'date' ? format(selectedDate!, 'PP') :
                    ''
                  }
                  onRemove={() => removeFilter(filter)}
                />
              ))}
            </motion.div>
          )}

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredNFTs.map((nft) => (
                <motion.div
                  key={nft.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <NFTCard
                    id={nft.id}
                    collectionId={nft.collectionId}
                    title={nft.title}
                    image={nft.image}
                    price={nft.price}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;
