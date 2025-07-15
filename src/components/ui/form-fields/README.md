# Form Field Components

A collection of reusable form field components with consistent styling, error handling, and validation support.

## Components

### BaseField
The foundation component that wraps other form fields with label, error display, and required field indicators.

### TextField
Basic text input with support for different input types.
```tsx
<TextField 
  id="name"
  label="Full Name"
  placeholder="Enter your name"
  required
  register={register("name")}
  error={errors.name?.message}
/>
```

### NumberField
Numeric input with min/max/step controls.
```tsx
<NumberField 
  id="age"
  label="Age"
  min={0}
  max={120}
  required
  register={register("age", { valueAsNumber: true })}
  error={errors.age?.message}
/>
```

### EmailField
Email input with built-in validation and optional mail icon.
```tsx
<EmailField 
  id="email"
  label="Email Address"
  required
  register={register("email")}
  error={errors.email?.message}
/>
```

### PhoneField
Phone number input with optional phone icon and country code support.
```tsx
<PhoneField 
  id="phone"
  label="Phone Number"
  required
  register={register("phone")}
  error={errors.phone?.message}
/>
```

### PasswordField
Password input with show/hide toggle and optional lock icon.
```tsx
<PasswordField 
  id="password"
  label="Password"
  required
  register={register("password")}
  error={errors.password?.message}
/>
```

### TextAreaField
Multi-line text input with customizable rows and resize options.
```tsx
<TextAreaField 
  id="description"
  label="Description"
  rows={4}
  resize={false}
  register={register("description")}
  error={errors.description?.message}
/>
```

### SelectField
Dropdown selection with customizable options.
```tsx
<SelectField 
  id="country"
  label="Country"
  options={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" }
  ]}
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  required
  error={errors.country?.message}
/>
```

### RadioField
Radio button group with horizontal or vertical layout.
```tsx
<RadioField 
  label="Gender"
  options={[
    { value: "male", label: "Male", id: "male" },
    { value: "female", label: "Female", id: "female" }
  ]}
  value={gender}
  onChange={setGender}
  orientation="horizontal"
  required
  error={errors.gender?.message}
/>
```

### CheckboxField
Single checkbox with label and optional description.
```tsx
<CheckboxField 
  id="terms"
  label="I agree to the terms and conditions"
  description="By checking this box, you agree to our terms of service"
  checked={agreedToTerms}
  onCheckedChange={setAgreedToTerms}
  required
  error={errors.terms?.message}
/>
```

### DateField
Date picker with modern calendar interface.
```tsx
<DateField 
  label="Date of Birth"
  value={dob}
  onChange={setDob}
  placeholder="Select your birth date"
  required
  error={errors.dob?.message}
/>
```

### SearchField
Search input with autocomplete suggestions.
```tsx
<SearchField 
  id="city"
  label="City"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  suggestions={cities}
  onSuggestionClick={setSelectedCity}
  selectedValue={selectedCity}
  showSuggestions={showSuggestions}
  required
  error={errors.city?.message}
/>
```

### FileUploadField
File upload with drag & drop support and file validation.
```tsx
<FileUploadField 
  id="avatar"
  label="Profile Picture"
  accept="image/*"
  maxSize={5}
  onFileChange={handleFileUpload}
  error={errors.avatar?.message}
/>
```

## Features

- **Consistent Design**: All components follow the same design system
- **Error Handling**: Built-in error display with red styling
- **Required Field Indicators**: Automatic asterisk (*) for required fields
- **Accessibility**: Proper labeling and ARIA attributes
- **TypeScript Support**: Full type safety and IntelliSense
- **React Hook Form Integration**: Works seamlessly with react-hook-form
- **Customizable**: Extensive props for customization
- **Responsive**: Mobile-friendly responsive design

## Usage with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField, EmailField, SelectField } from "@/components/ui/form-fields";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  country: z.string().min(1, "Country is required")
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField 
        id="name"
        label="Name"
        required
        register={register("name")}
        error={errors.name?.message}
      />
      
      <EmailField 
        id="email"
        label="Email"
        required
        register={register("email")}
        error={errors.email?.message}
      />
      
      <SelectField 
        id="country"
        label="Country"
        options={countryOptions}
        required
        error={errors.country?.message}
      />
    </form>
  );
}
```