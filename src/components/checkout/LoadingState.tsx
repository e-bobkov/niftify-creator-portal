
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Checking item availability...</h3>
        <p className="text-muted-foreground mt-2">Please wait a moment</p>
      </div>
    </div>
  );
};
