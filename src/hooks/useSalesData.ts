
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { Token } from "@/types/user";

interface SaleData extends Token {
  purchased_at: string | null;
  buyer_id: string | null;
}

export const useSalesData = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/profile/sales', {
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
      return data.sales as SaleData[];
    },
    enabled: !!token && !!user?.id,
  });
};

export const usePurchasesData = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await fetch('https://test.ftsoa.art/profile/purchases', {
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
      return data.purchases as SaleData[];
    },
    enabled: !!token && !!user?.id,
  });
};
