
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Sequence } from "../types/sequence";
import SequenceService from "../services/sequenceService";
import { Controller } from "react-hook-form";

interface SequenceFormProps {
  sequence?: Sequence;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  incrementPrefix: z.string().min(1, "Prefix is required"),
  incrementPadLength: z.number().min(1, "Pad Length is required"),
  incrementPadChar: z.number().min(1, "Pad Char is required"),
  // city: z.string().min(1, "City is required"),
  // pincode: z.string().min(1, "Pincode is required"),
  includeBranchCode: z.boolean().optional(),
  includeYear: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SequenceForm: React.FC<SequenceFormProps> = ({ sequence, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!sequence;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    incrementPrefix: sequence?.incrementPrefix || "",
    incrementPadLength: sequence?.incrementPadLength || 0,
    incrementPadChar: sequence?.incrementPadChar || 0,
    // city: sequence?.city || "",
    // pincode: sequence?.pincode?.toString() || "",
    includeBranchCode: sequence?.includeBranchCode || false,
    includeYear: sequence?.includeYear || false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Sequence type
      const sequenceData: Partial<Sequence> = {
        ...data,
        // pincode: parseInt(data.pincode),
        id: sequence?.id,
      };

      // Call API to save sequence
      await SequenceService.saveOrUpdate(sequenceData);
      
      toast({
        title: `Sequence ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving sequence:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} sequence. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="incrementPrefix"
            label=" Prefix"
          />
          
          <FormField
            control={form.control}
            name="incrementPadLength"
            label="Pad Length"
            type="number"
          />
          
          <FormField
            control={form.control}
            name="incrementPadChar"
            label="Pad Char"
            type="number"
          />
          
       
          <Controller
            control={form.control}
            name="includeBranchCode"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeBranchCode"
                  checked={field.value} // Use the boolean value for checked
                  onChange={(e) => field.onChange(e.target.checked)} // Update the value correctly
                  className="checkbox-class" // Add your checkbox styling here
                  name={field.name} // Explicitly set the name
                  ref={field.ref} // Pass the ref
                  onBlur={field.onBlur} // Pass the onBlur handler
                />
                <label htmlFor="includeBranchCode" className="label-class">Include Branch</label>
              </div>
            )}
          />

          
          <Controller
            control={form.control}
            name="includeYear"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeYear"
                  checked={field.value} // Use the boolean value for checked
                  onChange={(e) => field.onChange(e.target.checked)} // Update the value correctly
                  className="checkbox-class" // Add your checkbox styling here
                  name={field.name} // Explicitly set the name
                  ref={field.ref} // Pass the ref
                  onBlur={field.onBlur} // Pass the onBlur handler
                />
                <label htmlFor="includeYear" className="label-class">Include Year</label>
              </div>
            )}
          />
        </div>
          
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Sequence
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SequenceForm;
