
import { DollarSign, TrendingUp, Calendar, ShoppingBag } from "lucide-react";
import { Token } from "@/types/user";
import { format } from "date-fns";

interface SalesAnalyticsProps {
  sales: Token[];
  purchases: Token[];
}

export const SalesAnalytics = ({ sales, purchases }: SalesAnalyticsProps) => {
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.price || 0), 0);
  const latestSale = sales[0]?.sold_at ? format(new Date(sales[0].sold_at), 'PP') : 'No sales yet';
  const totalPurchases = purchases.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <h4 className="text-2xl font-bold">{totalSales}</h4>
          </div>
          <TrendingUp className="w-8 h-8 text-primary opacity-75" />
        </div>
      </div>

      <div className="glass-card p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <h4 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h4>
          </div>
          <DollarSign className="w-8 h-8 text-primary opacity-75" />
        </div>
      </div>

      <div className="glass-card p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Latest Sale</p>
            <h4 className="text-lg font-bold">{latestSale}</h4>
          </div>
          <Calendar className="w-8 h-8 text-primary opacity-75" />
        </div>
      </div>

      <div className="glass-card p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Purchases</p>
            <h4 className="text-2xl font-bold">{totalPurchases}</h4>
          </div>
          <ShoppingBag className="w-8 h-8 text-primary opacity-75" />
        </div>
      </div>
    </div>
  );
};
