
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Token } from "@/types/user";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { BaseComponentProps } from "@/types/common";

interface CollectionTokensProps extends BaseComponentProps {
  tokens: Token[];
  collectionId: string;
  collectionName?: string;
  authorId?: string;
  authorName?: string;
  collectionDescription?: string;
}

const TOKENS_PER_PAGE = 9;

export const CollectionTokens = ({ 
  tokens, 
  collectionId, 
  collectionName,
  authorId,
  authorName,
  collectionDescription 
}: CollectionTokensProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(tokens.length / TOKENS_PER_PAGE);
  const startIndex = (currentPage - 1) * TOKENS_PER_PAGE;
  const visibleTokens = tokens.slice(startIndex, startIndex + TOKENS_PER_PAGE);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Collection Tokens</h2>
      {!tokens?.length ? (
        <div className="text-muted-foreground text-center p-8">
          No tokens in this collection
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {visibleTokens.map((token) => (
              <NFTCard
                key={token.id}
                id={token.id.toString()}
                collectionId={collectionId}
                title={token.metadata.name}
                image={token.metadata.image}
                price={token.price || 0}
                soldAt={token.sold_at}
                owner={token.owner}
                collectionName={collectionName}
                authorId={authorId}
                authorName={authorName}
                collectionDescription={collectionDescription}
              />
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
        </>
      )}
    </div>
  );
};
