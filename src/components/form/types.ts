
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface BaseFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface InputFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {
  type?: "text" | "password";
}

export interface NumberFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {
  min?: number;
  max?: number;
  step?: number;
}

export interface EmailFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {}

export interface PhoneFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {}

export interface URLFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {}

export interface TextAreaFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {
  rows?: number;
}

export interface SelectFieldProps<T extends FieldValues = FieldValues> extends BaseFieldProps<T> {
  options: Array<{ value: string; label: string }>;
}
