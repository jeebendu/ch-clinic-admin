
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { RepairCompany } from "../types/repairCompany";
import RepairCompanyService from "../services/repairCompanyService";

interface RepairCompanyFormProps {
  repairCompany?: RepairCompany;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  billAddress: z.string().min(1, "Address is required"),
  billCity: z.string().min(1, "City is required"),
  billPhone: z.string().min(1, "Phone is required"),
 
});

type FormValues = z.infer<typeof formSchema>;

const RepairCompanyForm: React.FC<RepairCompanyFormProps> = ({ repairCompany, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!repairCompany;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: repairCompany?.name || "",
    billAddress: repairCompany?.billAddress || "",
    billCity: repairCompany?.billCity || "",
    billPhone: repairCompany?.billPhone || "",
   
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Repair Company type
      const repairData: Partial<RepairCompany> = {
        ...data,
        // pincode: parseInt(data.pincode),
        id: repairCompany?.id,
      };

      // Call API to save repairCompany
      await RepairCompanyService.saveOrUpdate(repairData);
      
      toast({
        title: `Repair Company ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving repairCompany:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} repairCompany. Please try again.`,
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
            label="Name"
          />
          
          <FormField
            control={form.control}
            name="billAddress"
            label="Bill Address"
          />
          <FormField
            control={form.control}
            name="billCity"
            label="Bill City"
          />
          
          <FormField
            control={form.control}
            name="billPhone"
            label="Phone"
          />
          
      
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Repair Company
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RepairCompanyForm;
