
import { useQuery } from "@tanstack/react-query";
import { fetchUserCollections, fetchCollectionTokens } from "@/api/collections";
import { useAuth } from "./useAuth";

export const useCollections = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['collections', user?.id],
    queryFn: () => fetchUserCollections(user?.id!, token!),
    enabled: !!token && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCollectionTokens = (collectionId?: string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['collection-tokens', collectionId],
    queryFn: () => fetchCollectionTokens(collectionId!, token!),
    enabled: !!token && !!collectionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};
