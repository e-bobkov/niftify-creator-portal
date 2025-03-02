
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Item Not Found</h3>
        <p className="text-muted-foreground mt-2 mb-6">We couldn't find this item in our marketplace.</p>
        <Button onClick={() => navigate('/marketplace')}>
          Return to Marketplace
        </Button>
      </div>
    </div>
  );
};
