
import { Collection, Token } from "@/types/user";

export const fetchCollectionTokens = async (collectionId: string, token: string): Promise<Token[]> => {
  const response = await fetch('https://test.ftsoa.art/profile/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      collection_id: collectionId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tokens');
  }

  const data = await response.json();
  return data.tokens;
};

export const fetchUserCollections = async (userId: string, token: string): Promise<Collection[]> => {
  const response = await fetch('https://test.ftsoa.art/profile/collections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      partner_id: userId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }

  const data = await response.json();
  return data.collections;
};
