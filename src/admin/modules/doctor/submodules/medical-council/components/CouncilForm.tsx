
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Updated import with correct casing
import BranchService from '@/admin/modules/branch/services/branchService';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { MedicalCouncil } from "../types/MedicalCouncil";
import MedicalCouncilService from "../service/MedicalCouncilService";

interface CouncilFormProps {
  council?: MedicalCouncil;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Council name is required"),

});

type FormValues = z.infer<typeof formSchema>;

const CouncilForm: React.FC<CouncilFormProps> = ({ council, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!council;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: council?.name || "",

  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const councilData: MedicalCouncil = {
        ...data,
        id: council?.id,
        name: data.name ?? " ",
      };

      // Call API to save branch
      await MedicalCouncilService.saveOrUpdate(councilData);
      
      toast({
        title: `Council ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving council:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} council. Please try again.`,
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
            label="Council Name"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Council
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouncilForm;
