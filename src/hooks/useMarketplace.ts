
import { useQuery } from "@tanstack/react-query";
import { 
  fetchMarketplaceCollections, 
  fetchCollectionTokens, 
  fetchTokenDetails,
  fetchAllTokens
} from "@/api/marketplace";

export const useMarketplaceCollections = () => {
  return useQuery({
    queryKey: ["marketplace-collections"],
    queryFn: fetchMarketplaceCollections,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarketplaceCollectionTokens = (collectionId?: string) => {
  return useQuery({
    queryKey: ["marketplace-collection-tokens", collectionId],
    queryFn: () => fetchCollectionTokens(collectionId!),
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarketplaceTokenDetails = (tokenId?: string) => {
  return useQuery({
    queryKey: ["marketplace-token-details", tokenId],
    queryFn: () => fetchTokenDetails(tokenId!),
    enabled: !!tokenId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAllMarketplaceTokens = () => {
  return useQuery({
    queryKey: ["marketplace-all-tokens"],
    queryFn: fetchAllTokens,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
