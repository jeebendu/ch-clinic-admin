
import * as React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Option {
  label: string;
  value: string;
}

interface MultipleSearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (values: string[]) => void;
  defaultValues?: string[];
  disabled?: boolean;
}

export const MultipleSearchableSelect = ({
  options,
  placeholder = "Select options",
  onChange,
  defaultValues = [],
  disabled = false,
}: MultipleSearchableSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValues);

  const handleSelect = (value: string) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  const removeValue = (value: string) => {
    const updatedValues = selectedValues.filter((v) => v !== value);
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
            onClick={() => setOpen(!open)}
          >
            {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
            <div className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{option.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedValues.map((value) => {
            const option = options.find((o) => o.value === value);
            return option ? (
              <Badge key={value} variant="secondary" className="mr-1 mb-1">
                {option.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => removeValue(value)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default MultipleSearchableSelect;
