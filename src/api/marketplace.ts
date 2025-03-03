
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

// Функция проверки статуса токена (доступен ли для покупки)
export const checkTokenStatus = async (tokenId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/token/status/${tokenId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check token status');
    }
    
    const data = await response.json();
    
    // Проверяем формат ответа - может быть либо булево значение, либо объект со свойством status
    if (typeof data === 'boolean') {
      return data;
    } else if (data && typeof data === 'object' && 'status' in data) {
      return data.status === true;
    }
    
    return false; // Неизвестный формат ответа считаем как недоступен
  } catch (error) {
    console.error('Error checking token status:', error);
    return false; // В случае ошибки считаем токен недоступным
  }
};

// New function to verify encrypted data and get token details
export const verifyEncryptedData = async (encryptedData: string): Promise<VerifyResponse> => {
  try {
    // Fix: We should not decode the data ourselves, the backend expects the raw data to be URL encoded
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

// Function to check if a string looks like an encrypted token rather than a numeric ID
export const isEncryptedToken = (tokenId: string): boolean => {
  // If it contains a colon or equals sign, it's likely an encrypted token
  return tokenId.includes(':') || tokenId.includes('=');
};
