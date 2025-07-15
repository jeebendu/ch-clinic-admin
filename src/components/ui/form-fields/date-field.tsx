import { DatePicker } from "@/components/ui/date-picker";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";

interface DateFieldProps {
  label: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DateField({ 
  label, 
  value, 
  onChange, 
  placeholder = "Select a date", 
  error, 
  required, 
  disabled, 
  className,
  minDate,
  maxDate
}: DateFieldProps) {
  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={className}
    >
      <DatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error ? "border-destructive" : "")}
      />
    </BaseField>
  );
}