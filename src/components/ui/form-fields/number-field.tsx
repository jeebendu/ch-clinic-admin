import { Input } from "@/components/ui/input";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";

interface NumberFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  register?: any;
  error?: string;
  required?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({ 
  id, 
  label, 
  placeholder, 
  error, 
  required, 
  className,
  disabled,
  register,
  min,
  max,
  step,
  ...props 
}: NumberFieldProps) {
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
        type="number"
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={cn(error ? "border-destructive focus:border-destructive" : "")}
        {...(register ? register : {})}
        {...props}
      />
    </BaseField>
  );
}