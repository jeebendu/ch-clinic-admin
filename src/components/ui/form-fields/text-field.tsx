import { Input } from "@/components/ui/input";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";

interface TextFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  register?: any;
  error?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  minLength?: number;
}

export function TextField({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  error, 
  required, 
  className,
  disabled,
  register,
  maxLength,
  minLength,
  ...props 
}: TextFieldProps) {
  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={className}
      htmlFor={id}
    >
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        className={cn(error ? "border-destructive focus:border-destructive" : "")}
        {...(register ? register : {})}
        {...props}
      />
    </BaseField>
  );
}