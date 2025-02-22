
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseComponentProps } from "@/types/common";

interface CollectionHeaderProps extends BaseComponentProps {
  onBack: () => void;
}

export const CollectionHeader = ({ onBack, className }: CollectionHeaderProps) => (
  <div className="mb-8">
    <Button 
      variant="ghost" 
      onClick={onBack}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  </div>
);
