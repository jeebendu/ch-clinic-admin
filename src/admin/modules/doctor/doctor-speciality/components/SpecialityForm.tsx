
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Speciality } from "../types/Speciality";
import SpecialityService from "../services/SpecialityService";

interface SpecialityFormProps {
  speciality?: Speciality;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Speciality name is required"),
  icon: z.string().min(1, "Speciality icon is required"),
  active: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SpecialityForm: React.FC<SpecialityFormProps> = ({ speciality, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!speciality;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: speciality?.name || "",
    icon: speciality?.icon || "",
    active: speciality?.active || true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Branch type
      const specialityData: Partial<Speciality> = {
        ...data,
       
        id: speciality?.id,
      };

      // Call API to save branch
      await SpecialityService.saveOrUpdate(specialityData);
      
      toast({
        title: `Speciality ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving speciality:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} speciality. Please try again.`,
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
            name="name"
            label="Speciality Name"
          />
          
          <FormField
            control={form.control}
            name="icon"
            label="Speciality Icon"
          />
          
          
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Branch
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SpecialityForm;
