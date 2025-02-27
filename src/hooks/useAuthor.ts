
import { useQuery } from "@tanstack/react-query";
import { 
  fetchAuthorByTokenId, 
  fetchAuthorById, 
  fetchAuthorSocials, 
  fetchAuthorCollections, 
  fetchAuthorCollectionTokens 
} from "@/api/author";

export const useAuthorByTokenId = (tokenId?: number) => {
  return useQuery({
    queryKey: ["author-by-token", tokenId],
    queryFn: () => fetchAuthorByTokenId(tokenId!),
    enabled: !!tokenId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAuthorById = (authorId?: string) => {
  return useQuery({
    queryKey: ["author", authorId],
    queryFn: () => fetchAuthorById(authorId!),
    enabled: !!authorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAuthorSocials = (authorId?: string) => {
  return useQuery({
    queryKey: ["author-socials", authorId],
    queryFn: () => fetchAuthorSocials(authorId!),
    enabled: !!authorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAuthorCollections = (authorId?: string) => {
  return useQuery({
    queryKey: ["author-collections", authorId],
    queryFn: () => fetchAuthorCollections(authorId!),
    enabled: !!authorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAuthorCollectionTokens = (authorId?: string, collectionId?: string) => {
  return useQuery({
    queryKey: ["author-collection-tokens", authorId, collectionId],
    queryFn: () => fetchAuthorCollectionTokens(authorId!, collectionId!),
    enabled: !!authorId && !!collectionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
