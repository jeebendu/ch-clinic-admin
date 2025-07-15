import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

export function CheckboxField({ 
  id,
  label, 
  description,
  checked, 
  onCheckedChange, 
  error, 
  required, 
  className,
  disabled
}: CheckboxFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-top space-x-2">
        <Checkbox 
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(error ? "border-destructive" : "")}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              required ? "after:content-['*'] after:text-destructive after:ml-1" : ""
            )}
          >
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}