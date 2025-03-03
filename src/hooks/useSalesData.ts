import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { Token } from "@/types/user";
import { getApiUrl, API_ENDPOINTS } from "@/config/api";

interface SaleData extends Token {
  purchased_at: string | null;
  buyer_id: string | null;
}

const fetchMetadata = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch metadata');
  }
  return response.json();
};

export const useSalesData = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await fetch(getApiUrl(API_ENDPOINTS.PROFILE.SALES), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: user?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch sales');
      }

      const data = await response.json();
      const sales = data.sales as SaleData[];

      const salesWithMetadata = await Promise.all(
        sales.map(async (sale) => {
          if (sale.metadata_url && !sale.metadata) {
            try {
              const metadata = await fetchMetadata(sale.metadata_url);
              return { ...sale, metadata };
            } catch (error) {
              console.error('Failed to fetch metadata:', error);
              return {
                ...sale,
                metadata: {
                  name: 'Unknown Token',
                  description: 'Metadata unavailable',
                  image: '/placeholder.svg'
                }
              };
            }
          }
          return sale;
        })
      );

      return salesWithMetadata;
    },
    enabled: !!token && !!user?.id,
  });
};

export const usePurchasesData = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await fetch(getApiUrl(API_ENDPOINTS.PROFILE.PURCHASES), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: user?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch purchases');
      }

      const data = await response.json();
      const purchases = data.purchases as SaleData[];

      const purchasesWithMetadata = await Promise.all(
        purchases.map(async (purchase) => {
          if (purchase.metadata_url && !purchase.metadata) {
            try {
              const metadata = await fetchMetadata(purchase.metadata_url);
              return { ...purchase, metadata };
            } catch (error) {
              console.error('Failed to fetch metadata:', error);
              return {
                ...purchase,
                metadata: {
                  name: 'Unknown Token',
                  description: 'Metadata unavailable',
                  image: '/placeholder.svg'
                }
              };
            }
          }
          return purchase;
        })
      );

      return purchasesWithMetadata;
    },
    enabled: !!token && !!user?.id,
  });
};
