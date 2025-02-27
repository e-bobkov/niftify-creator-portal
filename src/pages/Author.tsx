
import { useParams } from "react-router-dom";
import { useAuthorById, useAuthorSocials, useAuthorCollections } from "@/hooks/useAuthor";
import { AuthorHeader } from "@/components/author/AuthorHeader";
import { AuthorCollections } from "@/components/author/AuthorCollections";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Author = () => {
  const { authorId } = useParams();
  const { toast } = useToast();
  
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
    error: collectionsError 
  } = useAuthorCollections(authorId);

  useEffect(() => {
    if (authorError) {
      toast({
        title: "Error",
        description: "Failed to load author data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [authorError, toast]);

  const isLoading = isAuthorLoading || isSocialsLoading || isCollectionsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-primary/10 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-primary/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!author) return null;

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <AuthorHeader author={author} socials={socials} />
      <AuthorCollections 
        collections={collections || []} 
        authorId={author.id} 
      />
    </div>
  );
};

export default Author;
