
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

