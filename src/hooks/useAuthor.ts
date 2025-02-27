
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAuthorByTokenId, 
  fetchAuthorById, 
  fetchAuthorSocials, 
  fetchAuthorCollections, 
  fetchAuthorCollectionTokens 
} from "@/api/author";
import { useCallback } from "react";
import { Author, Collection, Token } from "@/types/user";

// Константы для ключей запросов и настроек кеширования
const QUERY_KEYS = {
  AUTHOR_BY_TOKEN: "author-by-token",
  AUTHOR: "author",
  AUTHOR_SOCIALS: "author-socials",
  AUTHOR_COLLECTIONS: "author-collections",
  AUTHOR_COLLECTION_TOKENS: "author-collection-tokens"
};

// Настройки кеширования
const CACHE_TIME = 1000 * 60 * 10; // 10 минут
const STALE_TIME = 1000 * 60 * 5; // 5 минут

export const useAuthorByTokenId = (tokenId?: number) => {
  const queryClient = useQueryClient();
  
  // Предварительная загрузка автора по ID токена
  const prefetchAuthorByToken = useCallback((id: number) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.AUTHOR_BY_TOKEN, id],
        queryFn: () => fetchAuthorByTokenId(id),
        staleTime: STALE_TIME
      });
    }
  }, [queryClient]);

  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.AUTHOR_BY_TOKEN, tokenId],
      queryFn: () => fetchAuthorByTokenId(tokenId!),
      enabled: !!tokenId,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false
    }),
    prefetchAuthorByToken
  };
};

export const useAuthorById = (authorId?: string) => {
  const queryClient = useQueryClient();
  
  // Предварительная загрузка автора по ID
  const prefetchAuthor = useCallback((id: string) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.AUTHOR, id],
        queryFn: () => fetchAuthorById(id),
        staleTime: STALE_TIME
      });
    }
  }, [queryClient]);

  // Функция для получения автора из кеша
  const getAuthorFromCache = useCallback((id: string): Author | undefined => {
    return queryClient.getQueryData<Author>(
      [QUERY_KEYS.AUTHOR, id]
    );
  }, [queryClient]);

  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.AUTHOR, authorId],
      queryFn: () => fetchAuthorById(authorId!),
      enabled: !!authorId,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false
    }),
    prefetchAuthor,
    getAuthorFromCache
  };
};

export const useAuthorSocials = (authorId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHOR_SOCIALS, authorId],
    queryFn: () => fetchAuthorSocials(authorId!),
    enabled: !!authorId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false
  });
};

export const useAuthorCollections = (authorId?: string) => {
  const queryClient = useQueryClient();
  
  // Предварительно загружаем коллекции автора
  const prefetchCollections = useCallback((id: string) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.AUTHOR_COLLECTIONS, id],
        queryFn: () => fetchAuthorCollections(id),
        staleTime: STALE_TIME
      });
    }
  }, [queryClient]);

  // Функция для получения коллекций из кеша
  const getCollectionsFromCache = useCallback((id: string): Collection[] | undefined => {
    return queryClient.getQueryData<Collection[]>(
      [QUERY_KEYS.AUTHOR_COLLECTIONS, id]
    );
  }, [queryClient]);

  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.AUTHOR_COLLECTIONS, authorId],
      queryFn: () => fetchAuthorCollections(authorId!),
      enabled: !!authorId,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false
    }),
    prefetchCollections,
    getCollectionsFromCache
  };
};

export const useAuthorCollectionTokens = (authorId?: string, collectionId?: string) => {
  const queryClient = useQueryClient();
  
  // Предварительно загружаем токены коллекции автора
  const prefetchCollectionTokens = useCallback((authorId: string, collectionId: string) => {
    if (authorId && collectionId) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.AUTHOR_COLLECTION_TOKENS, authorId, collectionId],
        queryFn: () => fetchAuthorCollectionTokens(authorId, collectionId),
        staleTime: STALE_TIME
      });
    }
  }, [queryClient]);

  // Функция для получения токенов из кеша
  const getTokensFromCache = useCallback((authorId: string, collectionId?: string): Token[] | undefined => {
    if (collectionId) {
      return queryClient.getQueryData<Token[]>(
        [QUERY_KEYS.AUTHOR_COLLECTION_TOKENS, authorId, collectionId]
      );
    }
    
    // Если collectionId не указан, пытаемся объединить данные из кеша для всех коллекций
    const collections = queryClient.getQueryData<Collection[]>(
      [QUERY_KEYS.AUTHOR_COLLECTIONS, authorId]
    );
    
    if (collections) {
      const allTokens: Token[] = [];
      
      for (const collection of collections) {
        const tokens = queryClient.getQueryData<Token[]>(
          [QUERY_KEYS.AUTHOR_COLLECTION_TOKENS, authorId, collection.id]
        );
        
        if (tokens) {
          allTokens.push(...tokens);
        }
      }
      
      return allTokens.length > 0 ? allTokens : undefined;
    }
    
    return undefined;
  }, [queryClient]);

  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.AUTHOR_COLLECTION_TOKENS, authorId, collectionId],
      queryFn: () => {
        if (collectionId) {
          // Если collectionId указан, загружаем токены только для этой коллекции
          return fetchAuthorCollectionTokens(authorId!, collectionId);
        } else {
          // Если collectionId не указан, загружаем все токены автора
          return fetchAuthorCollections(authorId!)
            .then(collections => 
              Promise.all(
                collections.map(collection => 
                  fetchAuthorCollectionTokens(authorId!, collection.id)
                )
              )
            )
            .then(tokensArrays => tokensArrays.flat());
        }
      },
      enabled: !!authorId,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      initialData: authorId ? () => getTokensFromCache(authorId, collectionId) : undefined
    }),
    prefetchCollectionTokens,
    getTokensFromCache
  };
};
