
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Visit } from "../types/Visit";
import visitService from "../services/visitService";

export interface VisitFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

interface VisitFormProps {
  visit?: Visit | null;
  onSuccess: (response: any) => void;
  showSubmitButton?: boolean;
}

// Define the form schema with zod
const formSchema = z.object({
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  visitType: z.string().min(1, "Visit type is required"),
  notes: z.string().optional(),
  // Add other fields as needed based on Visit type
});

type FormValues = z.infer<typeof formSchema>;

const VisitForm = forwardRef<VisitFormRef, VisitFormProps>(({ 
  visit, 
  onSuccess, 
  showSubmitButton = true 
}, ref) => {
  const { toast } = useToast();
  const isEditing = !!visit;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    chiefComplaint: visit?.chiefComplaint || "",
    visitType: visit?.visitType || "",
    notes: visit?.notes || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when visit prop changes
  useEffect(() => {
    if (visit) {
      form.reset({
        chiefComplaint: visit.chiefComplaint || "",
        visitType: visit.visitType || "",
        notes: visit.notes || "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [visit, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      const visitData: Partial<Visit> = {
        ...data,
        id: visit?.id,
      };

      console.log('Submitting visit data:', visitData);

      // Call API to save visit
      const response = await visitService.saveOrUpdate(visitData);
      
      console.log('Visit save response:', response);

      toast({
        title: `Visit ${isEditing ? "updated" : "created"} successfully`,
      });
      
      // Call onSuccess with the response
      onSuccess(response);
    } catch (error) {
      console.error("Error saving visit:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} visit. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)();
    },
    resetForm: () => {
      form.reset(defaultValues);
    },
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="visitType"
            label="Visit Type"
            placeholder="Select visit type"
          />
          
          <FormField
            control={form.control}
            name="chiefComplaint"
            label="Chief Complaint"
            placeholder="Enter chief complaint"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="notes"
            label="Notes"
            placeholder="Enter additional notes"
          />
        </div>
        
        {showSubmitButton && (
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button" 
              className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-brand-primary hover:bg-brand-secondary"
            >
              {isEditing ? "Update" : "Create"} Visit
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
});

VisitForm.displayName = "VisitForm";

export default VisitForm;
