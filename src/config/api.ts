
// API Configuration

// Base API URL - can be easily changed to point to different environments
export const API_BASE_URL = "https://auto.ftsoa.art";

// API Endpoints (paths only, will be combined with base URL)
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    AUTO: "/auto",
  },
  
  // Profile endpoints
  PROFILE: {
    MAIN: "/profile/",
    COLLECTIONS: "/profile/collections",
    TOKENS: "/profile/tokens",
    SALES: "/profile/sales",
    PURCHASES: "/profile/purchases",
  },
  
  // Marketplace endpoints
  MARKETPLACE: {
    COLLECTIONS: "/marketlpace/collections",
    TOKENS: "/marketlpace/tokens",
    ITEM: "/marketlpace/item",
    ALL_TOKENS: "/marketlpace/all-tokens",
  },
  
  // Author endpoints
  AUTHOR: {
    MAIN: "/author",
    BY_TOKEN: "/author/by-token",
    COLLECTIONS: "/collections",
    SOCIAL: "/social",
  },
  
  // Token endpoints
  TOKEN: {
    STATUS: "/token/status",
  },
  
  // Order endpoints
  ORDER: {
    CREATE: "/order/create",
  },
  
  // Verification endpoint
  VERIFY: "/verify",
  
  // Collections endpoints
  COLLECTIONS: {
    TOP: "/collections/top",
  },
};

// Helper function to build full API URLs
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
