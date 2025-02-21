
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
  imageUrl: string;
}
