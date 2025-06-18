
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ClinicRequest } from "../../types/ClinicRequest";
import ClinicRequestService from "../../services/clinicRequest/clinicRequestService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";

interface ClinicRequestFormProps {
  clinicRequest?: ClinicRequest;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  clientUrl: z.string().min(1, "URL is required"),
  title: z.string().min(1, "Title is required"),
  contact: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
  clientId: z.string().min(1, "Client ID is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactDesignation: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  favIcon: z.string().optional(),
  bannerHome: z.string().optional(),
  logo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ClinicRequestForm: React.FC<ClinicRequestFormProps> = ({ clinicRequest, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!clinicRequest;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: clinicRequest?.name || "",
    clientUrl: clinicRequest?.clientUrl || "",
    title: clinicRequest?.title || "",
    contact: clinicRequest?.contact || "",
    email: clinicRequest?.email || "",
    clientId: clinicRequest?.clientId || "",
    contactName: clinicRequest?.contactName || "",
    contactDesignation: clinicRequest?.contactDesignation || "",
    address: clinicRequest?.address || "",
    city: clinicRequest?.city || "",
    favIcon: clinicRequest?.favIcon || "",
    bannerHome: clinicRequest?.bannerHome || "",
    logo: clinicRequest?.logo || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match ClinicRequest type
      const requestData: Partial<ClinicRequest> = {
        ...data,
        id: clinicRequest?.id,
      };

      // Call API to save clinic request
      await ClinicRequestService.saveOrUpdate(requestData);
      
      toast({
        title: `Clinic request ${isEditing ? "updated" : "created"} successfully`,
        className: "bg-clinic-primary text-white"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving clinic request:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} clinic request. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-auto max-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            label="Clinic Name (Used as ID)"
          />
          
          <FormField
            control={form.control}
            name="title"
            label="Display Title"
          />
          
          <FormField
            control={form.control}
            name="clientId"
            label="Client ID"
          />
          
          <FormField
            control={form.control}
            name="clientUrl"
            label="Domain URL"
          />
          
          <FormField
            control={form.control}
            name="contact"
            label="Contact Phone"
          />
          
          <FormField
            control={form.control}
            name="email"
            label="Contact Email"
          />
          
          <FormField
            control={form.control}
            name="contactName"
            label="Contact Person Name"
          />
          
          <FormField
            control={form.control}
            name="contactDesignation"
            label="Contact Person Designation"
          />
          
          <FormField
            control={form.control}
            name="address"
            label="Address"
          />
          
          <FormField
            control={form.control}
            name="city"
            label="City"
          />
          
          {/* Logo, favicon and banner fields are kept in types but hidden from UI */}
        </div>
      </form>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onSuccess} className="border-clinic-primary/20 text-clinic-primary hover:bg-clinic-primary/10">
          Cancel
        </Button>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="bg-clinic-primary hover:bg-clinic-secondary">
          {isEditing ? "Update" : "Submit"} Request
        </Button>
      </div>
    </Form>
  );
};

export default ClinicRequestForm;
