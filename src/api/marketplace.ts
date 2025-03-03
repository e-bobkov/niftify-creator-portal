
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

export interface VerifyResponse {
  token: MarketplaceToken;
  email?: string;
  out_trade_no?: string;
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

export const checkTokenStatus = async (tokenId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/token/status/${tokenId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check token status');
    }
    
    const data = await response.json();
    
    if (typeof data === 'boolean') {
      return data;
    } else if (data && typeof data === 'object' && 'status' in data) {
      return data.status === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token status:', error);
    return false;
  }
};

export const verifyEncryptedData = async (encryptedData: string): Promise<VerifyResponse> => {
  try {
    const response = await fetch(`${API_URL}/verify/${encodeURIComponent(encryptedData)}`);
    
    if (!response.ok) {
      throw new Error('Failed to verify encrypted data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying encrypted data:', error);
    throw new Error('Failed to verify checkout link. Please try again later.');
  }
};

export const isEncryptedToken = (tokenId: string): boolean => {
  return tokenId.includes(':') || tokenId.includes('=');
};

export const autoAuthenticate = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error('Auto-authentication failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auto-authentication error:', error);
    throw new Error('Failed to authenticate. Please try again later.');
  }
};
