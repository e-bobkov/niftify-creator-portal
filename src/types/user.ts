
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar: number;
  role: 'user' | 'partner';
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
  partner_id?: string; // Добавляем partner_id
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
  buyer_id?: string | null;
  owner?: {
    first_name: string;
    last_name: string;
  } | null;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
  metadata_url?: string;
}

export interface Author {
  id: string;
  email: string;
  full_name: string | null;
  role: 'partner';
  created_at: string;
  updated_at: string;
  bio: string;
  first_name: string;
  last_name: string;
}

export interface AuthorSocial {
  id: string;
  profile_id: string;
  social: string;
  link: string;
}
