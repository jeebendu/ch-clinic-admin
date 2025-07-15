import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
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
  showToggle?: boolean;
}

export function PasswordField({ 
  id, 
  label, 
  placeholder = "Enter password", 
  error, 
  required, 
  className,
  disabled,
  register,
  showIcon = true,
  showToggle = true,
  ...props 
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

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
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            showIcon ? "pl-10" : "",
            showToggle ? "pr-10" : "",
            error ? "border-destructive focus:border-destructive" : ""
          )}
          {...(register ? register : {})}
          {...props}
        />
        {showToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    </BaseField>
  );
}