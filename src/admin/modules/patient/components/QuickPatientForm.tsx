
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { 
  InputField, 
  EmailField, 
  PhoneField, 
  FormRow,
  FormSection 
} from "@/components/form";
import PatientService from "../services/patientService";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "../types/Patient";

const quickPatientSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.number().min(1, "Age is required").max(150, "Invalid age"),
});

type QuickPatientFormData = z.infer<typeof quickPatientSchema>;

export interface QuickPatientFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

interface QuickPatientFormProps {
  onSuccess: (patient: Patient) => void;
  onError?: (error: string) => void;
  showSubmitButton?: boolean;
}

const QuickPatientForm = forwardRef<QuickPatientFormRef, QuickPatientFormProps>(
  ({ onSuccess, onError, showSubmitButton = true }, ref) => {
    const { toast } = useToast();
    
    const form = useForm<QuickPatientFormData>({
      resolver: zodResolver(quickPatientSchema),
      defaultValues: {
        firstname: "",
        lastname: "",
        mobile: "",
        email: "",
        gender: "Male",
        age: undefined,
      },
    });

    const onSubmit = async (data: QuickPatientFormData) => {
      try {
        const patientData = {
          ...data,
          user: {
            phone: data.mobile,
            email: data.email || undefined,
          },
        };

        const response = await PatientService.saveOrUpdate(patientData);
        
        if (response?.status === true) {
          toast({
            title: "Success",
            description: "Patient created successfully",
          });
          onSuccess(response.data);
          form.reset();
        } else {
          const errorMessage = response?.message || "Failed to create patient";
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          onError?.(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error.message || "Failed to create patient";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        onError?.(errorMessage);
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(onSubmit)();
      },
      resetForm: () => {
        form.reset();
      },
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection title="Basic Information">
            <FormRow columns={2}>
              <InputField
                control={form.control}
                name="firstname"
                label="First Name"
                required
              />
              <InputField
                control={form.control}
                name="lastname"
                label="Last Name"
                required
              />
            </FormRow>
            
            <FormRow columns={3}>
              <PhoneField
                control={form.control}
                name="mobile"
                label="Mobile Number"
                required
              />
              <InputField
                control={form.control}
                name="age"
                label="Age"
                type="number"
                required
              />
              <InputField
                control={form.control}
                name="gender"
                label="Gender"
                required
              />
            </FormRow>

            <EmailField
              control={form.control}
              name="email"
              label="Email Address"
            />
          </FormSection>

          {showSubmitButton && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating..." : "Create Patient"}
              </button>
            </div>
          )}
        </form>
      </Form>
    );
  }
);

QuickPatientForm.displayName = "QuickPatientForm";

export default QuickPatientForm;
