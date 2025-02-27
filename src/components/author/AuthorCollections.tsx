
import { useState } from "react";
import { Collection } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthorCollectionsProps {
  collections: Collection[];
  authorId: string;
  onCollectionClick?: (collectionId: string) => void;
}

const COLLECTIONS_PER_PAGE = 6;

export const AuthorCollections = ({ collections, authorId, onCollectionClick }: AuthorCollectionsProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(collections.length / COLLECTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * COLLECTIONS_PER_PAGE;
  const visibleCollections = collections.slice(startIndex, startIndex + COLLECTIONS_PER_PAGE);

  const handleCollectionClick = (collectionId: string) => {
    if (onCollectionClick) {
      onCollectionClick(collectionId);
    } else {
      navigate(`/author/${authorId}/collection/${collectionId}`);
    }
  };
  
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (!collections.length) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Collections</h2>
        <p className="text-muted-foreground">This author has no collections yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Collections</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCollections.map((collection) => (
          <motion.div
            key={collection.id}
            whileHover={{ scale: 1.03 }}
            className="glass-card rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleCollectionClick(collection.id)}
          >
            <div className="aspect-square relative">
              <img 
                src={collection.image_url || "/placeholder.svg"} 
                alt={collection.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{collection.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {collection.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
