
import { memo } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseComponentProps } from "@/types/common";

interface FormErrorMessageProps extends BaseComponentProps {
  message: string;
}

export const FormErrorMessage = memo(({ message, className }: FormErrorMessageProps) => (
  <div className={cn("flex items-center gap-2 text-destructive text-sm", className)}>
    <AlertCircle className="w-4 h-4" />
    <p>{message}</p>
  </div>
));

FormErrorMessage.displayName = 'FormErrorMessage';
