
import { useParams, useNavigate } from "react-router-dom";
import { useAuthorById, useAuthorSocials, useAuthorCollections } from "@/hooks/useAuthor";
import { AuthorHeader } from "@/components/author/AuthorHeader";
import { AuthorCollections } from "@/components/author/AuthorCollections";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useCallback } from "react";
import { LoadingState } from "@/components/collection/LoadingState";

const Author = () => {
  const { authorId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    data: author, 
    isLoading: isAuthorLoading, 
    error: authorError 
  } = useAuthorById(authorId);
  
  const { 
    data: socials, 
    isLoading: isSocialsLoading, 
    error: socialsError 
  } = useAuthorSocials(authorId);
  
  const { 
    data: collections, 
    isLoading: isCollectionsLoading, 
    error: collectionsError,
    prefetchCollections
  } = useAuthorCollections(authorId);

  // Обработка ошибок
  useEffect(() => {
    if (authorError || socialsError || collectionsError) {
      toast({
        title: "Error",
        description: "Failed to load author data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [authorError, socialsError, collectionsError, toast]);

  // Предварительно загружаем коллекции автора, когда получаем данные об авторе
  useEffect(() => {
    if (authorId && !collections && !isCollectionsLoading) {
      prefetchCollections(authorId);
    }
  }, [authorId, collections, isCollectionsLoading, prefetchCollections]);

  // Обработка клика по коллекции для навигации
  const handleCollectionClick = useCallback((collectionId: string) => {
    if (authorId) {
      navigate(`/author/${authorId}/collection/${collectionId}`);
    }
  }, [authorId, navigate]);

  const isLoading = isAuthorLoading || isSocialsLoading || isCollectionsLoading;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="glass-card rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold">Author not found</h2>
          <p className="text-muted-foreground mt-2">
            The author you're looking for might have been removed or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <AuthorHeader author={author} socials={socials} />
      <AuthorCollections 
        collections={collections || []} 
        authorId={author.id} 
        onCollectionClick={handleCollectionClick}
      />
    </div>
  );
};

export default Author;
