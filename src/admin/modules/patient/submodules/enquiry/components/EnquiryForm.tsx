
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Enquiry } from "@/admin/modules/enquiry/types/Enquiry";
import { useToast } from "@/components/ui/use-toast";
import enquiryService from "@/admin/modules/enquiry/service/EnquiryService";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leadDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Text areas for longer content */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="needs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Needs</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
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
