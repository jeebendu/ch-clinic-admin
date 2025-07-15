import { Input } from "@/components/ui/input";
import { BaseField } from "./base-field";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchOption {
  id: number;
  name: string;
  disabled?: boolean;
}

interface SearchFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions?: SearchOption[];
  onSuggestionClick?: (suggestion: SearchOption) => void;
  selectedValue?: SearchOption | null;
  showSuggestions?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  showIcon?: boolean;
  loading?: boolean;
}

export function SearchField({
  id,
  label,
  placeholder = "Search...",
  value,
  onChange,
  suggestions = [],
  onSuggestionClick,
  selectedValue,
  showSuggestions = false,
  error,
  required,
  className,
  showIcon = true,
  loading = false
}: SearchFieldProps) {
  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={cn("relative", className)}
      htmlFor={id}
    >
      <div className="relative">
        {showIcon && (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            showIcon ? "pl-10" : "",
            error ? "border-destructive focus:border-destructive" : ""
          )}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && selectedValue?.name !== value && (
        <ul className="absolute z-10 bg-background border border-border mt-1 w-full rounded-md shadow-md max-h-40 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className={cn(
                "px-4 py-2 hover:bg-accent cursor-pointer",
                suggestion.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !suggestion.disabled && onSuggestionClick?.(suggestion)}
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

      {loading && (
        <p className="text-sm text-muted-foreground mt-1">Searching...</p>
      )}
    </BaseField>
  );
}