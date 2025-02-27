
import { Author, AuthorSocial, Collection, Token } from "@/types/user";

const API_URL = "https://test.ftsoa.art";

export async function fetchAuthorByTokenId(tokenId: number): Promise<Author> {
  const response = await fetch(`${API_URL}/author/by-token/${tokenId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch author for token ${tokenId}`);
  }
  return response.json();
}

export async function fetchAuthorById(authorId: string): Promise<Author> {
  const response = await fetch(`${API_URL}/author/${authorId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch author ${authorId}`);
  }
  return response.json();
}

export async function fetchAuthorSocials(authorId: string): Promise<AuthorSocial[]> {
  const response = await fetch(`${API_URL}/author/${authorId}/social`);
  if (!response.ok) {
    throw new Error(`Failed to fetch socials for author ${authorId}`);
  }
  return response.json();
}

export async function fetchAuthorCollections(authorId: string): Promise<Collection[]> {
  const response = await fetch(`${API_URL}/author/${authorId}/collections`);
  if (!response.ok) {
    throw new Error(`Failed to fetch collections for author ${authorId}`);
  }
  return response.json();
}

export async function fetchAuthorCollectionTokens(authorId: string, collectionId: string): Promise<Token[]> {
  const response = await fetch(`${API_URL}/author/${authorId}/collections/${collectionId}/tokens`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens for collection ${collectionId} of author ${authorId}`);
  }
  return response.json();
}
