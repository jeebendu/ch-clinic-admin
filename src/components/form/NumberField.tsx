
import React from "react";
import { FieldValues } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BaseFieldProps } from "./types";

export interface NumberFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {
  min?: number;
  max?: number;
  step?: number;
}

function NumberField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
  min,
  max,
  step,
}: NumberFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === '' ? undefined : Number(value));
              }}
              className="border-brand-primary/20 focus-visible:ring-brand-primary"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default NumberField;
