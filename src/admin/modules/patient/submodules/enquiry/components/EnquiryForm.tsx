
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Button } from "@/components/ui/button";
import { Enquiry } from "@/admin/modules/enquiry/types/Enquiry";
import { useToast } from "@/components/ui/use-toast";
import enquiryService from "@/admin/modules/enquiry/service/EnquiryService";
import { Textarea } from "@/components/ui/textarea";

interface EnquiryFormProps {
  enquiry?: Enquiry | null;
  onClose: () => void;
}

const EnquiryForm = ({ enquiry, onClose }: EnquiryFormProps) => {
  const form = useForm({
    defaultValues: {
      firstName: enquiry?.firstName || "",
      lastName: enquiry?.lastName || "",
      mobile: enquiry?.mobile || "",
      enquiryServiceType: enquiry?.enquiryServiceType?.id?.toString() || "",
      needs: enquiry?.needs || "",
      remark: enquiry?.remark || "",
      notes: enquiry?.notes || "",
      countryCode: enquiry?.countryCode || "",
      city: enquiry?.city || "",
      leadDate: enquiry?.leadDate || new Date(),
    }
  });

  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await enquiryService.saveOrUpdate({
        ...enquiry,
        ...data,
        leadDate: new Date(data.leadDate),
      });
      toast({
        title: "Success",
        description: `Enquiry ${enquiry ? "updated" : "created"} successfully`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save enquiry",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            label="First Name"
          />
          <FormField
            control={form.control}
            name="lastName"
            label="Last Name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryCode"
            label="Country Code"
          />
          <FormField
            control={form.control}
            name="mobile"
            label="Mobile"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            label="City"
          />
          <FormField
            control={form.control}
            name="leadDate"
            label="Lead Date"
            type="date"
          />
        </div>
        
        {/* Replace component="textarea" with <Textarea /> components */}
        <div className="space-y-4">
          <Form.Field
            control={form.control}
            name="needs"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Needs</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          
          <Form.Field
            control={form.control}
            name="remark"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Remarks</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            control={form.control}
            name="notes"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Notes</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {enquiry ? "Update" : "Create"} Enquiry
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnquiryForm;
