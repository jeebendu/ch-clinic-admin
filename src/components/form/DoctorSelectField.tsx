
import React from "react";
import { FieldValues } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DoctorAutocomplete from "@/admin/modules/doctor/components/DoctorAutocomplete";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { BaseFieldProps } from "./types";

export interface DoctorSelectFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {}

function DoctorSelectField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
}: DoctorSelectFieldProps<T>) {
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
            <DoctorAutocomplete
              value={field.value}
              onSelect={(doctor: Doctor | null) => field.onChange(doctor)}
              placeholder={placeholder || `Select ${label.toLowerCase()}`}
              className={disabled ? "opacity-50 cursor-not-allowed" : ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default DoctorSelectField;
