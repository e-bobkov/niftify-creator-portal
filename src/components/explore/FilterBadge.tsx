
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface FilterBadgeProps {
  filter: string;
  value: string;
  onRemove: () => void;
}

export const FilterBadge = ({ filter, value, onRemove }: FilterBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Badge variant="secondary" className="px-3 py-1">
        <span className="text-xs text-muted-foreground capitalize mr-2">{filter}:</span>
        <span className="text-xs font-medium">{value}</span>
        <button
          onClick={onRemove}
          className="ml-2 hover:text-destructive transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </Badge>
    </motion.div>
  );
};
