
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar: number;
  social?: {
    telegram?: string;
    discord?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  contract_address: string;
  image_url: string;
  created_at: string;
}

export interface Token {
  id: number;
  collection_id: string;
  token_id: number;
  amount: number;
  minted_at: string;
  sold_at: string | null;
  address: string | null;
  price: number | null;
  standart: string | null;
  chain: string;
  updated_at: string | null;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}
