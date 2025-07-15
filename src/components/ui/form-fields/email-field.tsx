import { Input } from "@/components/ui/input";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

interface EmailFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  register?: any;
  error?: string;
  required?: boolean;
  className?: string;
  showIcon?: boolean;
}

export function EmailField({ 
  id, 
  label, 
  placeholder = "Enter email address", 
  error, 
  required, 
  className,
  disabled,
  register,
  showIcon = true,
  ...props 
}: EmailFieldProps) {
  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={className}
      htmlFor={id}
    >
      <div className="relative">
        {showIcon && (
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            showIcon ? "pl-10" : "",
            error ? "border-destructive focus:border-destructive" : ""
          )}
          {...(register ? register : {})}
          {...props}
        />
      </div>
    </BaseField>
  );
}