import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export const CheckoutLayout = ({ children }: CheckoutLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-5 md:p-6 space-y-6">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Complete your purchase</h1>
              {children}
            </div>
          </motion.div>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center mb-1">
              <LockKeyhole className="h-3 w-3 mr-1" />
              <span>Secure Checkout</span>
            </div>
            <p>All transactions are encrypted and secure.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
