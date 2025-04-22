
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import BrandService from "../service/BrandService";
import { Brand } from "../types/Brand";

interface BrandFormProps {
  brand?: Brand;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  
});

type FormValues = z.infer<typeof formSchema>;

const BrandForm: React.FC<BrandFormProps> = ({ brand, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!brand;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: brand?.name || "",
  
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Brand type
      const brandData: Partial<Brand> = {
        ...data,
        // pincode: parseInt(data.pincode),
        id: brand?.id,
      };

      // Call API to save brand
      await BrandService.saveOrUpdate(brandData);
      
      toast({
        title: `Brand ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving brand:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} brand. Please try again.`,
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
        
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Brand
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BrandForm;
