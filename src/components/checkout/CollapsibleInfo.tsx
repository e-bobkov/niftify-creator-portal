
import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleInfoProps {
  title: string;
  icon: ReactNode;
  iconColor?: string;
  children: ReactNode;
}

export const CollapsibleInfo = ({ 
  title, 
  icon, 
  iconColor = "text-primary", 
  children 
}: CollapsibleInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-secondary/10 hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={iconColor}>{icon}</div>
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="p-3 text-sm space-y-2 bg-secondary/5">
          {children}
        </div>
      )}
    </div>
  );
};
