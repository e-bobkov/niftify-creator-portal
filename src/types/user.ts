
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
  id: string;
  collection_id: string;
  partner_id: string;
  buyer_id: string;
  out_trade_no: string;
  total_amount: number;
  currency: string;
  status: string;
  card_number: string;
  transaction_id: string;
  sign: string;
  paid_at: string;
  expired_at: string;
  created_at: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}
