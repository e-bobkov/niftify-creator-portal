
import { memo } from "react";
import { cn } from "@/lib/utils";
import { BaseComponentProps } from "@/types/common";

interface SkeletonCardProps extends BaseComponentProps {
  count?: number;
  aspectRatio?: "square" | "video" | "banner";
}

export const SkeletonCard = memo(({ 
  count = 1, 
  aspectRatio = "square",
  className 
}: SkeletonCardProps) => {
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[21/9]"
  }[aspectRatio];

  return (
    <div className={cn("grid gap-4", className)} style={{
      gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-4">
          <div className={cn("bg-primary/10 rounded-lg", aspectRatioClass)}></div>
          <div className="space-y-2">
            <div className="h-4 bg-primary/10 rounded w-2/3"></div>
            <div className="h-3 bg-primary/10 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';
