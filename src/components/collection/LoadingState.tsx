
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { BaseComponentProps } from "@/types/common";

export const LoadingState = ({ className }: BaseComponentProps) => (
  <div className="container mx-auto px-4 py-24 max-w-4xl">
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-primary/10 rounded-lg"></div>
      <SkeletonCard count={6} />
    </div>
  </div>
);
