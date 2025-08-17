
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  InputField, 
  EmailField, 
  PhoneField, 
  FormRow,
  FormSection 
} from "@/components/form";

// Visit form schema
const visitFormSchema = z.object({
  patientFirstname: z.string().min(1, "First name is required"),
  patientLastname: z.string().min(1, "Last name is required"),
  patientPhone: z.string().min(1, "Phone is required"),
  patientEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
  visitDate: z.string().min(1, "Visit date is required"),
  visitTime: z.string().min(1, "Visit time is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  branchId: z.string().min(1, "Branch is required"),
  visitType: z.enum(["CONSULTATION", "FOLLOW_UP", "EMERGENCY", "ROUTINE_CHECKUP"]).default("CONSULTATION"),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
  chiefComplaint: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitFormSchema>;

interface VisitFormProps {
  visit?: any;
  onSuccess: () => void;
}

export interface VisitFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

const VisitForm = forwardRef<VisitFormRef, VisitFormProps>(({ visit, onSuccess }, ref) => {
  const { toast } = useToast();
  const isEditing = !!visit;

  const defaultValues: Partial<VisitFormValues> = {
    patientFirstname: visit?.patient?.firstname || "",
    patientLastname: visit?.patient?.lastname || "",
    patientPhone: visit?.patient?.mobile || visit?.patient?.phone || "",
    patientEmail: visit?.patient?.email || "",
    visitDate: visit?.visitDate ? new Date(visit.visitDate).toISOString().split('T')[0] : "",
    visitTime: visit?.visitTime || "",
    doctorId: visit?.doctor?.id?.toString() || "",
    branchId: visit?.branch?.id?.toString() || "",
    visitType: visit?.visitType || "CONSULTATION",
    status: visit?.status || "SCHEDULED",
    chiefComplaint: visit?.chiefComplaint || "",
    notes: visit?.notes || "",
  };

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: VisitFormValues) => {
    try {
      console.log("Visit data:", data);
      
      toast({
        title: `Visit ${isEditing ? "updated" : "created"} successfully`,
        className: "bg-clinic-primary text-white"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving visit:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} visit. Please try again.`,
        variant: "destructive",
      });
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)();
    },
    resetForm: () => {
      form.reset(defaultValues);
    },
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Patient Information" description="Basic patient details for the visit">
          <FormRow columns={2}>
            <InputField
              control={form.control}
              name="patientFirstname"
              label="Patient First Name"
              required
            />
            
            <InputField
              control={form.control}
              name="patientLastname"
              label="Patient Last Name"
              required
            />
            
            <PhoneField
              control={form.control}
              name="patientPhone"
              label="Patient Phone"
              required
            />
            
            <EmailField
              control={form.control}
              name="patientEmail"
              label="Patient Email"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Visit Details" description="Schedule and visit information">
          <FormRow columns={2}>
            <InputField
              control={form.control}
              name="visitDate"
              label="Visit Date"
              type="date"
              required
            />
            
            <InputField
              control={form.control}
              name="visitTime"
              label="Visit Time"
              type="time"
              required
            />
            
            <InputField
              control={form.control}
              name="doctorId"
              label="Doctor ID"
              required
            />
            
            <InputField
              control={form.control}
              name="branchId"
              label="Branch ID"
              required
            />
          </FormRow>

          <FormRow columns={2}>
            <FormField
              control={form.control}
              name="visitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CONSULTATION">Consultation</SelectItem>
                      <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency</SelectItem>
                      <SelectItem value="ROUTINE_CHECKUP">Routine Checkup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormRow>
        </FormSection>

        <FormSection title="Medical Information" description="Chief complaint and additional notes">
          <FormField
            control={form.control}
            name="chiefComplaint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chief Complaint</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter chief complaint"
                    {...field}
                    rows={3}
                  />
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
                  <Textarea
                    placeholder="Enter additional notes"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onSuccess} className="border-clinic-primary/20 text-clinic-primary hover:bg-clinic-primary/10">
            Cancel
          </Button>
          <Button type="submit" className="bg-clinic-primary hover:bg-clinic-secondary">
            {isEditing ? "Update" : "Create"} Visit
          </Button>
        </div>
      </form>
    </Form>
  );
});

VisitForm.displayName = "VisitForm";

export default VisitForm;
