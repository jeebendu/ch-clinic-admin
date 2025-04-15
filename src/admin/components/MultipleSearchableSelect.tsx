
import React, { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface MultipleSearchableSelectProps {
  options: Option[];
  onChange: (values: string[]) => void;
  values?: string[];
  placeholder?: string;
  className?: string;
}

export const MultipleSearchableSelect = ({
  options,
  onChange,
  values = [],
  placeholder = "Select options",
  className,
}: MultipleSearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(values);
  
  useEffect(() => {
    setSelectedValues(values);
  }, [values]);

  const handleSelect = (currentValue: string) => {
    let updatedValues: string[];
    
    if (selectedValues.includes(currentValue)) {
      updatedValues = selectedValues.filter(v => v !== currentValue);
    } else {
      updatedValues = [...selectedValues, currentValue];
    }
    
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  const removeValue = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  const getSelectedLabels = () => {
    return selectedValues.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full min-h-10 h-auto justify-between flex-wrap", className)}
        >
          <div className="flex flex-wrap gap-1 mr-2">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              getSelectedLabels().map((label, index) => (
                <Badge variant="secondary" key={selectedValues[index]} className="mr-1 mb-1">
                  {label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => removeValue(selectedValues[index], e)}
                  />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selectedValues.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    {option.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultipleSearchableSelect;
