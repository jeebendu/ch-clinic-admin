
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Branch } from "../types/Branch";
import BranchService from '@/admin/modules/branch/services/BranchService';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  code: z.string().min(1, "Branch code is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(1, "Pincode is required"),
  active: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BranchForm: React.FC<BranchFormProps> = ({ branch, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!branch;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: branch?.name || "",
    code: branch?.code || "",
    location: branch?.location || "",
    city: branch?.city || "",
    pincode: branch?.pincode?.toString() || "",
    active: branch?.active || true,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Branch type
      const branchData: Partial<Branch> = {
        ...data,
        pincode: parseInt(data.pincode),
        id: branch?.id,
      };

      // Call API to save branch
      await BranchService.saveOrUpdate(branchData);
      
      toast({
        title: `Branch ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving branch:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} branch. Please try again.`,
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
            label="Branch Name"
          />
          
          <FormField
            control={form.control}
            name="code"
            label="Branch Code"
          />
          
          <FormField
            control={form.control}
            name="location"
            label="Location"
          />
          
          <FormField
            control={form.control}
            name="city"
            label="City"
          />
          
          <FormField
            control={form.control}
            name="pincode"
            label="Pincode"
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

export default BranchForm;
