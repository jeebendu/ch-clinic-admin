import { Input } from "@/components/ui/input";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

interface PhoneFieldProps {
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
  countryCode?: string;
}

export function PhoneField({ 
  id, 
  label, 
  placeholder = "Enter phone number", 
  error, 
  required, 
  className,
  disabled,
  register,
  showIcon = true,
  countryCode = "+1",
  ...props 
}: PhoneFieldProps) {
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
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          type="tel"
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