
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthorById, useAuthorSocials, useAuthorCollections } from "@/hooks/useAuthor";
import { AuthorHeader } from "@/components/author/AuthorHeader";
import { AuthorCollections } from "@/components/author/AuthorCollections";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useCallback, useState } from "react";
import { LoadingState } from "@/components/collection/LoadingState";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Breadcrumb {
  path: string;
  label: string;
}

const Author = () => {
  const { authorId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  
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

  // Загружаем хлебные крошки из sessionStorage
  useEffect(() => {
    const savedBreadcrumbs = sessionStorage.getItem('breadcrumbs');
    if (savedBreadcrumbs) {
      try {
        const parsedBreadcrumbs = JSON.parse(savedBreadcrumbs) as Breadcrumb[];
        // Проверяем, нужно ли добавить текущего автора в хлебные крошки
        const lastCrumb = parsedBreadcrumbs[parsedBreadcrumbs.length - 1];
        if (lastCrumb && !lastCrumb.path.includes(`/author/${authorId}`)) {
          // Если последняя хлебная крошка не ведет к текущему автору, добавляем его
          setBreadcrumbs([...parsedBreadcrumbs]);
        } else {
          setBreadcrumbs(parsedBreadcrumbs);
        }
      } catch (e) {
        console.error('Failed to parse breadcrumbs:', e);
        // Если не удалось разобрать JSON, создаем базовые хлебные крошки
        setBreadcrumbs([
          { path: '/marketplace', label: 'Marketplace' },
          { path: `/author/${authorId}`, label: 'Author' }
        ]);
      }
    } else {
      // Если нет сохраненных хлебных крошек, создаем базовые
      setBreadcrumbs([
        { path: '/marketplace', label: 'Marketplace' },
        { path: `/author/${authorId}`, label: 'Author' }
      ]);
    }
    
    // Сохраняем текущий путь для последующей навигации
    sessionStorage.setItem('lastVisitedPath', location.pathname);
  }, [authorId, location.pathname]);

  // Обновляем хлебные крошки когда получаем данные об авторе
  useEffect(() => {
    if (author) {
      const updatedBreadcrumbs = [...breadcrumbs];
      // Находим индекс крошки автора, если она есть
      const authorIndex = updatedBreadcrumbs.findIndex(crumb => 
        crumb.path.includes(`/author/${authorId}`)
      );
      
      if (authorIndex !== -1) {
        // Обновляем существующую крошку автора
        updatedBreadcrumbs[authorIndex].label = `${author.first_name} ${author.last_name}`;
      } else {
        // Добавляем новую крошку автора, если ее нет
        updatedBreadcrumbs.push({
          path: `/author/${authorId}`,
          label: `${author.first_name} ${author.last_name}`
        });
      }
      
      setBreadcrumbs(updatedBreadcrumbs);
    }
  }, [author, authorId, breadcrumbs]);

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
    if (authorId && author) {
      // Создаем новые хлебные крошки для перехода к коллекции
      const collectionInfo = collections?.find(c => c.id === collectionId);
      const newBreadcrumbs = [...breadcrumbs];
      
      // Очищаем все крошки после автора, если они есть
      const authorIndex = newBreadcrumbs.findIndex(crumb => 
        crumb.path.includes(`/author/${authorId}`)
      );
      
      if (authorIndex !== -1) {
        newBreadcrumbs.splice(authorIndex + 1);
      }
      
      // Добавляем крошку коллекции
      newBreadcrumbs.push({
        path: `/author/${authorId}/collection/${collectionId}`,
        label: collectionInfo?.name || 'Collection'
      });
      
      sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
      navigate(`/author/${authorId}/collection/${collectionId}`);
    }
  }, [authorId, author, collections, navigate, breadcrumbs]);

  const handleBack = useCallback(() => {
    // Возвращаемся на предыдущую страницу в истории навигации
    const lastPath = sessionStorage.getItem('lastVisitedPath');
    if (lastPath && lastPath !== location.pathname) {
      navigate(-1);
    } else {
      navigate('/marketplace');
    }
  }, [navigate, location.pathname]);

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
      
      {/* Кнопка назад */}
      <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      
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
