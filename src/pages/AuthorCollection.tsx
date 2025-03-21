
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthorById, useAuthorCollections, useAuthorCollectionTokens } from "@/hooks/useAuthor";
import { useToast } from "@/components/ui/use-toast";
import { NFTCard } from "@/components/NFTCard";
import { useEffect, useCallback, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { LoadingState } from "@/components/collection/LoadingState";

interface Breadcrumb {
  path: string;
  label: string;
}

const TOKENS_PER_PAGE = 6;

const AuthorCollection = () => {
  const { authorId, collectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: author } = useAuthorById(authorId);
  
  const { 
    data: collections, 
    isLoading: isCollectionsLoading 
  } = useAuthorCollections(authorId);
  
  const { 
    data: tokens, 
    isLoading: isTokensLoading, 
    error: tokensError,
    prefetchCollectionTokens
  } = useAuthorCollectionTokens(authorId, collectionId);

  // Извлекаем данные о текущей коллекции
  const collection = useMemo(() => {
    return collections?.find(c => c.id === collectionId);
  }, [collections, collectionId]);

  // Пагинация токенов
  const paginatedTokens = useMemo(() => {
    if (!tokens) return [];
    const startIndex = (currentPage - 1) * TOKENS_PER_PAGE;
    return tokens.slice(startIndex, startIndex + TOKENS_PER_PAGE);
  }, [tokens, currentPage]);

  const totalPages = useMemo(() => {
    if (!tokens) return 0;
    return Math.ceil(tokens.length / TOKENS_PER_PAGE);
  }, [tokens]);

  // Загружаем хлебные крошки из sessionStorage
  useEffect(() => {
    const savedBreadcrumbs = sessionStorage.getItem('breadcrumbs');
    if (savedBreadcrumbs) {
      try {
        const parsedBreadcrumbs = JSON.parse(savedBreadcrumbs) as Breadcrumb[];
        // Проверяем, нужно ли добавить текущую коллекцию в хлебные крошки
        const lastCrumb = parsedBreadcrumbs[parsedBreadcrumbs.length - 1];
        if (lastCrumb && !lastCrumb.path.includes(`/collection/${collectionId}`)) {
          setBreadcrumbs(parsedBreadcrumbs);
        } else {
          setBreadcrumbs(parsedBreadcrumbs);
        }
      } catch (e) {
        console.error('Failed to parse breadcrumbs:', e);
        setBreadcrumbs([
          { path: '/marketplace', label: 'Marketplace' },
          { path: `/author/${authorId}`, label: 'Author' },
          { path: `/author/${authorId}/collection/${collectionId}`, label: 'Collection' }
        ]);
      }
    } else {
      // Если нет сохраненных хлебных крошек, создаем базовые
      setBreadcrumbs([
        { path: '/marketplace', label: 'Marketplace' },
        { path: `/author/${authorId}`, label: author?.first_name ? `${author.first_name} ${author.last_name}` : 'Author' },
        { path: `/author/${authorId}/collection/${collectionId}`, label: 'Collection' }
      ]);
    }
    
    // Сохраняем текущий путь
    sessionStorage.setItem('lastVisitedPath', location.pathname);
  }, [authorId, collectionId, author, location.pathname]);

  // Обновляем хлебные крошки когда получаем данные о коллекции
  useEffect(() => {
    if (collection) {
      const updatedBreadcrumbs = [...breadcrumbs];
      // Находим индекс крошки коллекции, если она есть
      const collectionIndex = updatedBreadcrumbs.findIndex(crumb => 
        crumb.path.includes(`/collection/${collectionId}`)
      );
      
      if (collectionIndex !== -1) {
        // Обновляем существующую крошку коллекции
        updatedBreadcrumbs[collectionIndex].label = collection.name;
      } else {
        // Добавляем новую крошку коллекции, если ее нет
        updatedBreadcrumbs.push({
          path: `/author/${authorId}/collection/${collectionId}`,
          label: collection.name
        });
      }
      
      setBreadcrumbs(updatedBreadcrumbs);
      sessionStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
    }
  }, [collection, collectionId, authorId, breadcrumbs]);

  // Обработка ошибок
  useEffect(() => {
    if (tokensError) {
      toast({
        title: "Error",
        description: "Failed to load collection tokens. Please try again later.",
        variant: "destructive"
      });
    }
  }, [tokensError, toast]);

  // Предварительная загрузка токенов коллекции
  useEffect(() => {
    if (authorId && collectionId && !tokens && !isTokensLoading) {
      prefetchCollectionTokens(authorId, collectionId);
    }
  }, [authorId, collectionId, tokens, isTokensLoading, prefetchCollectionTokens]);

  // Обработчик для перехода к деталям токена
  const handleTokenClick = useCallback((tokenId: number | string) => {
    if (authorId) {
      // Обновляем хлебные крошки для токена
      const token = tokens?.find(t => t.id?.toString() === tokenId.toString());
      const newBreadcrumbs = [...breadcrumbs];
      
      // Добавляем крошку токена, если она еще не существует
      const exists = newBreadcrumbs.some(crumb => 
        crumb.path.includes(`/token/${tokenId}`)
      );
      
      if (!exists) {
        newBreadcrumbs.push({
          path: `/author/${authorId}/token/${tokenId}`,
          label: token?.metadata?.name || `Token #${token?.token_id || tokenId}`
        });
        sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
      }
      
      navigate(`/author/${authorId}/token/${tokenId}`);
    }
  }, [authorId, navigate, tokens, breadcrumbs]);

  // Обработчик для нажатия на контракт
  const handleContractClick = useCallback((address: string) => {
    if (address) {
      window.open(`https://polygonscan.com/address/${address}`, '_blank');
    }
  }, []);
  
  const handleBack = useCallback(() => {
    // Возвращаем к автору, сохраняя историю хлебных крошек
    if (authorId) {
      // Обрезаем хлебные крошки до автора
      const newBreadcrumbs = breadcrumbs.filter(crumb => 
        !crumb.path.includes(`/collection/`) && !crumb.path.includes(`/token/`)
      );
      sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
      navigate(`/author/${authorId}`);
    } else {
      navigate(-1);
    }
  }, [authorId, navigate, breadcrumbs]);

  const isLoading = isTokensLoading || isCollectionsLoading || !collection;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(`/author/${authorId}`)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Author
        </Button>
        <div className="glass-card rounded-xl p-8 mt-4 text-center">
          <h2 className="text-xl font-semibold">Collection not found</h2>
          <p className="text-muted-foreground mt-2">
            The collection you're looking for might have been removed or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const authorFullName = author?.first_name && author?.last_name 
    ? `${author.first_name} ${author.last_name}` 
    : author?.full_name || 'Unknown Author';

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      {/* Хлебные крошки */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <Home className="h-3.5 w-3.5 mr-1" />
          Home
        </Button>
        
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center">
            <span className="mx-2">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground">{crumb.label}</span>
            ) : (
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                onClick={() => navigate(crumb.path)}
              >
                {crumb.label}
              </Button>
            )}
          </span>
        ))}
      </div>
    
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to {author?.first_name}'s Collections
        </Button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-64 rounded-lg overflow-hidden">
            <img 
              src={collection.image_url || "/placeholder.svg"} 
              alt={collection.name} 
              className="w-full h-full object-cover"
              loading="eager" // Приоритетная загрузка изображения
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{collection.name}</h1>
            <p className="text-muted-foreground mb-4">{collection.description}</p>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Created</div>
                <div className="font-medium">
                  {format(new Date(collection.created_at), 'PP')}
                </div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1">Items</div>
                <div className="font-medium">{tokens?.length || 0}</div>
              </div>
              
              {collection.contract_address && (
                <div>
                  <div className="text-muted-foreground mb-1">Contract</div>
                  <button 
                    onClick={() => handleContractClick(collection.contract_address)}
                    className="flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    {collection.contract_address.slice(0, 6)}...{collection.contract_address.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Collection Items</h2>
        
        {!tokens?.length ? (
          <p className="text-muted-foreground text-center p-8">
            No items found in this collection
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTokens.map((token) => (
                <NFTCard
                  key={token.token_id}
                  id={token.id?.toString() || token.token_id.toString()}
                  collectionId={token.collection_id}
                  title={token.metadata?.name || `Token #${token.token_id}`}
                  image={token.metadata?.image || "/placeholder.svg"}
                  price={token.price || 0}
                  soldAt={token.sold_at}
                  showBuyButton={!token.sold_at}
                  collectionName={collection.name}
                  authorId={authorId}
                  authorName={authorFullName}
                  onExplore={() => {
                    if (token.id !== undefined) {
                      handleTokenClick(token.id);
                    } else {
                      console.error("Token id is undefined", token);
                      toast({
                        title: "Error",
                        description: "Could not navigate to token details",
                        variant: "destructive"
                      });
                    }
                  }}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorCollection;
