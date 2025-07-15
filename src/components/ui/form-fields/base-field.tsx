import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function BaseField({ 
  label, 
  error, 
  required, 
  className, 
  children, 
  htmlFor 
}: BaseFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={htmlFor} 
        className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}
      >
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}