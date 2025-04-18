
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Courier } from "../types/courier";
import CourierService from "../services/courierService";

interface CourierFormProps {
  courier?: Courier;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.string().min(1, "Website Url is required"),
  apiUrl: z.string().min(1, "Api Url is required"),
 
});

type FormValues = z.infer<typeof formSchema>;

const CourierForm: React.FC<CourierFormProps> = ({ courier, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!courier;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: courier?.name || "",
    websiteUrl: courier?.websiteUrl || "",
    apiUrl: courier?.apiUrl || "",
    
   
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Courier type
      const courierData: Partial<Courier> = {
        ...data,
        // pincode: parseInt(data.pincode),
        id: courier?.id,
      };

      // Call API to save courier
      await CourierService.saveOrUpdate(courierData);
      
      toast({
        title: `Courier ${isEditing ? "updated" : "added"} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving courier:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} courier. Please try again.`,
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
            name="websiteUrl"
            label="Website Url"
          />
          <FormField
            control={form.control}
            name="apiUrl"
            label="Api Url"
          />
          
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
            {isEditing ? "Update" : "Add"} Courier
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourierForm;
