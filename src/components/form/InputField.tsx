
import React from "react";
import { FieldValues } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputFieldProps } from "./types";

function InputField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  required = false,
  disabled = false,
  className,
}: InputFieldProps<T>) {
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
              type={type}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              disabled={disabled}
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

export default InputField;
