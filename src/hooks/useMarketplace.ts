
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchMarketplaceCollections, 
  fetchCollectionTokens, 
  fetchTokenDetails,
  fetchAllTokens
} from "@/api/marketplace";
import { useCallback } from "react";
import { MarketplaceToken } from "@/api/marketplace";

// Константы для ключей запросов и настроек кеширования
const QUERY_KEYS = {
  COLLECTIONS: "marketplace-collections",
  COLLECTION_TOKENS: "marketplace-collection-tokens",
  TOKEN_DETAILS: "marketplace-token-details",
  ALL_TOKENS: "marketplace-all-tokens"
};

// Настройки кеширования
const CACHE_TIME = 1000 * 60 * 10; // 10 минут
const STALE_TIME = 1000 * 60 * 5; // 5 минут

export const useMarketplaceCollections = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COLLECTIONS],
    queryFn: fetchMarketplaceCollections,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false
  });
};

export const useMarketplaceCollectionTokens = (collectionId?: string) => {
  const queryClient = useQueryClient();
  
  // Предварительно загружаем токены коллекции при навигации
  const prefetchTokens = useCallback((id: string) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.COLLECTION_TOKENS, id],
        queryFn: () => fetchCollectionTokens(id),
        staleTime: STALE_TIME
      });
    }
  }, [queryClient]);

  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.COLLECTION_TOKENS, collectionId],
      queryFn: () => fetchCollectionTokens(collectionId!),
      enabled: !!collectionId,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false
    }),
    prefetchTokens
  };
};

export const useMarketplaceTokenDetails = (tokenId?: string) => {
  const queryClient = useQueryClient();
  
  // Предварительная загрузка деталей токена
  const prefetchTokenDetails = useCallback((id: string) => {
    if (id) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.TOKEN_DETAILS, id],
        queryFn: () => fetchTokenDetails(id),
        staleTime: STALE_TIME
      });
    }
  }, [queryClient]);

  // Функция для получения деталей токена из кеша (если они там есть)
  const getTokenFromCache = useCallback((id: string): MarketplaceToken | undefined => {
    // Пытаемся найти детали в кеше для конкретного токена
    const tokenFromCache = queryClient.getQueryData<MarketplaceToken>(
      [QUERY_KEYS.TOKEN_DETAILS, id]
    );
    
    if (tokenFromCache) return tokenFromCache;
    
    // Если нет, пытаемся найти в кеше для всех токенов
    const allTokensData = queryClient.getQueryData<Record<string, MarketplaceToken[]>>(
      [QUERY_KEYS.ALL_TOKENS]
    );
    
    if (allTokensData) {
      for (const collectionTokens of Object.values(allTokensData)) {
        const token = collectionTokens.find(t => t.id?.toString() === id);
        if (token) return token;
      }
    }
    
    return undefined;
  }, [queryClient]);

  return {
    ...useQuery({
      queryKey: [QUERY_KEYS.TOKEN_DETAILS, tokenId],
      queryFn: () => fetchTokenDetails(tokenId!),
      enabled: !!tokenId,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      initialData: tokenId ? () => getTokenFromCache(tokenId) : undefined
    }),
    prefetchTokenDetails,
    getTokenFromCache
  };
};

export const useAllMarketplaceTokens = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_TOKENS],
    queryFn: fetchAllTokens,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false
  });
};
