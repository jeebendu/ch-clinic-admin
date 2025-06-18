
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clinic } from "../../types/Clinic";
import ClinicService from "../../services/clinic/clinicService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";

interface ClinicFormProps {
  clinic?: Clinic;
  onSuccess: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  email: z.string().email("Valid email is required"),
  contact: z.string().min(1, "Contact is required"),
  address: z.string().min(1, "Address is required"),
  "tenant.clientId": z.string().min(1, "Client ID is required"),
  "tenant.clientUrl": z.string().min(1, "URL is required"),
  "tenant.title": z.string().min(1, "Title is required"),
  "tenant.favIcon": z.string().optional(),
  "tenant.bannerHome": z.string().optional(),
  "tenant.logo": z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ClinicForm: React.FC<ClinicFormProps> = ({ clinic, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!clinic;

  // Set default values for the form
  const defaultValues: Partial<FormValues> = {
    name: clinic?.name || "",
    email: clinic?.email || "",
    contact: clinic?.contact || "",
    address: clinic?.address || "",
    "tenant.clientId": clinic?.tenant?.clientId || "",
    "tenant.clientUrl": clinic?.tenant?.clientUrl || "",
    "tenant.title": clinic?.tenant?.title || "",
    "tenant.favIcon": clinic?.tenant?.favIcon || "",
    "tenant.bannerHome": clinic?.tenant?.bannerHome || "",
    "tenant.logo": clinic?.tenant?.logo || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match Clinic type
      const clinicData: Partial<Clinic> = {
        id: clinic?.id,
        name: data.name,
        email: data.email,
        contact: data.contact,
        address: data.address,
        tenant: {
          id: clinic?.tenant?.id,
          clientId: data["tenant.clientId"],
          clientUrl: data["tenant.clientUrl"],
          title: data["tenant.title"],
          favIcon: data["tenant.favIcon"] || "",
          bannerHome: data["tenant.bannerHome"] || "",
          logo: data["tenant.logo"] || "",
          status: clinic?.tenant?.status || "active",
          schemaName: clinic?.tenant?.schemaName || data.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
          plan: undefined
        }
      };

      // Call API to save clinic
      const res = await ClinicService.saveOrUpdate(clinicData);
      if (res.data.status) {
        toast({
          title: `Clinic ${isEditing ? "updated" : "added"} successfully`,
          className: "bg-clinic-primary text-white"
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "add"} clinic. Please try again.`,
          variant: "destructive",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving clinic:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} clinic. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-auto max-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 font-medium text-lg border-b pb-2">Clinic Information</div>

          <FormField
            control={form.control}
            name="name"
            label="Clinic Name"
          />

          <FormField
            control={form.control}
            name="email"
            label="Email"
          />

          <FormField
            control={form.control}
            name="contact"
            label="Contact"
          />

          <FormField
            control={form.control}
            name="address"
            label="Address"
          />

          <div className="col-span-2 font-medium text-lg border-b pb-2 mt-4">Tenant Information</div>

          <FormField
            control={form.control}
            name="tenant.clientId"
            label="Client ID"
          />

          <FormField
            control={form.control}
            name="tenant.title"
            label="Display Title"
          />

          <FormField
            control={form.control}
            name="tenant.clientUrl"
            label="Domain URL"
          />

          <FormField
            control={form.control}
            name="tenant.logo"
            label="Logo URL"
          />

          <FormField
            control={form.control}
            name="tenant.favIcon"
            label="Favicon URL"
          />

          <FormField
            control={form.control}
            name="tenant.bannerHome"
            label="Home Banner URL"
          />
        </div>
      </form>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onSuccess} className="border-clinic-primary/20 text-clinic-primary hover:bg-clinic-primary/10">
          Cancel
        </Button>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="bg-clinic-primary hover:bg-clinic-secondary">
          {isEditing ? "Update" : "Add"} Clinic
        </Button>
      </div>
    </Form>
  );
};

export default ClinicForm;
