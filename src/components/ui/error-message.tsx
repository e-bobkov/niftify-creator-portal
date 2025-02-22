
import { memo } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseComponentProps } from "@/types/common";

interface ErrorMessageProps extends BaseComponentProps {
  message: string;
}

export const ErrorMessage = memo(({ message, className }: ErrorMessageProps) => (
  <div className={cn("flex items-center gap-2 text-destructive", className)}>
    <AlertCircle className="w-5 h-5" />
    <p>{message}</p>
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';
