import { Textarea } from "@/components/ui/textarea";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";

interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  register?: any;
  error?: string;
  required?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}

export function TextAreaField({ 
  id, 
  label, 
  placeholder, 
  error, 
  required, 
  className,
  disabled,
  register,
  rows = 3,
  maxLength,
  resize = true,
  ...props 
}: TextAreaFieldProps) {
  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={className}
      htmlFor={id}
    >
      <Textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          !resize ? "resize-none" : "",
          error ? "border-destructive focus:border-destructive" : ""
        )}
        {...(register ? register : {})}
        {...props}
      />
    </BaseField>
  );
}