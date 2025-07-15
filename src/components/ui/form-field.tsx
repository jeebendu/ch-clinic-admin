import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  id: string;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  register?: any;
}

interface RadioFieldProps extends BaseFieldProps {
  options: { value: string; label: string; id: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

interface DateFieldProps extends BaseFieldProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
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
  ...props 
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error ? "border-destructive focus:border-destructive" : "")}
        {...(register ? register : {})}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export function RadioField({ 
  label, 
  options, 
  value, 
  onChange, 
  error, 
  required, 
  className 
}: RadioFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
        {label}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-row space-x-4"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.id} />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export function DateField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required, 
  disabled, 
  className 
}: DateFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
        {label}
      </Label>
      <DatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error ? "border-destructive" : "")}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

interface SearchFieldProps extends BaseFieldProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions?: { id: number; name: string }[];
  onSuggestionClick?: (suggestion: { id: number; name: string }) => void;
  selectedValue?: { id: number; name: string } | null;
  showSuggestions?: boolean;
}

export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  suggestions = [],
  onSuggestionClick,
  selectedValue,
  showSuggestions = false,
  error,
  required,
  className
}: SearchFieldProps) {
  return (
    <div className={cn("space-y-2 relative", className)}>
      <Label htmlFor={id} className={required ? "after:content-['*'] after:text-destructive after:ml-1" : ""}>
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(error ? "border-destructive focus:border-destructive" : "")}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && selectedValue?.name !== value && (
        <ul className="absolute z-10 bg-background border border-border mt-1 w-full rounded-md shadow-md max-h-40 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => onSuggestionClick?.(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}

      {selectedValue && (
        <p className="text-sm text-muted-foreground mt-1">
          Selected: <strong>{selectedValue.name}</strong>
        </p>
      )}
    </div>
  );
}