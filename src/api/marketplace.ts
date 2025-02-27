
import { Token } from "@/types/user";

export interface MarketplaceCollection {
  id: string;
  name: string;
  description: string;
  contract_address: string;
  image_url: string;
  created_at: string;
  partner_id: string;
}

export interface MarketplaceToken extends Token {
  collection_id: string;
  token_id: number;
  amount: number;
  metadata_url?: string;
  minted_at: string;
  sold_at: string | null;
  address: string | null;
  price: number | null;
  standart: string | null;
  chain: string;
}

const API_URL = "https://test.ftsoa.art";

export async function fetchMarketplaceCollections(): Promise<MarketplaceCollection[]> {
  const response = await fetch(`${API_URL}/marketlpace/collections`);
  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }
  return response.json();
}

export async function fetchCollectionTokens(collectionId: string): Promise<MarketplaceToken[]> {
  const response = await fetch(`${API_URL}/marketlpace/tokens/${collectionId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens for collection ${collectionId}`);
  }
  return response.json();
}

export async function fetchTokenDetails(tokenId: string): Promise<MarketplaceToken> {
  const response = await fetch(`${API_URL}/marketlpace/item/${tokenId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch token details for token ${tokenId}`);
  }
  return response.json();
}

export async function fetchAllTokens(): Promise<Record<string, MarketplaceToken[]>> {
  const response = await fetch(`${API_URL}/marketlpace/all-tokens`);
  if (!response.ok) {
    throw new Error("Failed to fetch all tokens");
  }
  return response.json();
}
