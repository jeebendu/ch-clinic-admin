import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BaseField } from "./base-field";

interface RadioOption {
  value: string;
  label: string;
  id: string;
  disabled?: boolean;
}

interface RadioFieldProps {
  label: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function RadioField({ 
  label, 
  options, 
  value, 
  onChange, 
  error, 
  required, 
  className,
  orientation = "horizontal"
}: RadioFieldProps) {
  return (
    <BaseField 
      label={label} 
      error={error} 
      required={required} 
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={orientation === "horizontal" ? "flex flex-row space-x-4" : "space-y-2"}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={option.id}
              disabled={option.disabled}
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </BaseField>
  );
}