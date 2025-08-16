
import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/admin/components/FormField";
import { Visit } from "../types/Visit";
import { Patient } from "../../../types/Patient";
import { Doctor } from "@/admin/modules/appointments/types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock services - replace with actual service calls
const mockPatients: Patient[] = [];
const mockDoctors: Doctor[] = [];
const mockBranches: Branch[] = [];

export interface VisitFormRef {
  submitForm: () => void;
}

interface VisitFormProps {
  visit?: Visit | null;
  onSuccess: (response: any) => void;
  showSubmitButton?: boolean;
}

const formSchema = z.object({
  branch: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  patient: z.object({
    id: z.number(),
    firstname: z.string(),
    lastname: z.string(),
  }).optional(),
  referByDoctor: z.object({
    id: z.number(),
    firstname: z.string(),
    lastname: z.string(),
  }).optional(),
  consultingDoctor: z.object({
    id: z.number(),
    firstname: z.string(),
    lastname: z.string(),
  }).optional(),
  complaints: z.string().optional(),
  scheduleDate: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentAmount: z.number().optional(),
  paymentPaid: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const VisitForm = forwardRef<VisitFormRef, VisitFormProps>(({ visit, onSuccess, showSubmitButton = true }, ref) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues: Partial<FormValues> = {
    branch: visit?.branch,
    patient: visit?.patient,
    referByDoctor: visit?.referByDoctor,
    consultingDoctor: visit?.consultingDoctor,
    complaints: visit?.complaints || "",
    scheduleDate: visit?.scheduleDate || "",
    type: visit?.type || "",
    status: visit?.status || "",
    notes: visit?.notes || "",
    paymentStatus: visit?.paymentStatus || "",
    paymentAmount: visit?.paymentAmount || 0,
    paymentPaid: visit?.paymentPaid || 0,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)();
    },
  }));

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      const visitData: Partial<Visit> = {
        ...data,
        id: visit?.id,
      };

      // Mock API call - replace with actual service
      console.log("Saving visit:", visitData);
      
      // Simulate API response
      const response = {
        status: true,
        data: visitData,
      };

      toast({
        title: `Visit ${visit ? "updated" : "created"} successfully`,
      });

      onSuccess(response);
    } catch (error) {
      console.error("Error saving visit:", error);
      toast({
        title: "Error",
        description: `Failed to ${visit ? "update" : "create"} visit. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Branch</Label>
            <Controller
              control={form.control}
              name="branch"
              render={({ field }) => (
                <Select
                  value={field.value?.id?.toString() || ""}
                  onValueChange={(value) => {
                    if (value === "none") {
                      field.onChange(undefined);
                    } else {
                      const selectedBranch = mockBranches.find(b => b.id?.toString() === value);
                      field.onChange(selectedBranch);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No branch selected</SelectItem>
                    {mockBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id?.toString() || ""}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Patient</Label>
            <Controller
              control={form.control}
              name="patient"
              render={({ field }) => (
                <Select
                  value={field.value?.id?.toString() || ""}
                  onValueChange={(value) => {
                    if (value === "none") {
                      field.onChange(undefined);
                    } else {
                      const selectedPatient = mockPatients.find(p => p.id?.toString() === value);
                      field.onChange(selectedPatient);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No patient selected</SelectItem>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id?.toString() || ""}>
                        {patient.firstname} {patient.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Referring Doctor</Label>
            <Controller
              control={form.control}
              name="referByDoctor"
              render={({ field }) => (
                <Select
                  value={field.value?.id?.toString() || ""}
                  onValueChange={(value) => {
                    if (value === "none") {
                      field.onChange(undefined);
                    } else {
                      const selectedDoctor = mockDoctors.find(d => d.id?.toString() === value);
                      field.onChange(selectedDoctor);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select referring doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No doctor selected</SelectItem>
                    {mockDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id?.toString() || ""}>
                        Dr. {doctor.firstname} {doctor.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Consulting Doctor</Label>
            <Controller
              control={form.control}
              name="consultingDoctor"
              render={({ field }) => (
                <Select
                  value={field.value?.id?.toString() || ""}
                  onValueChange={(value) => {
                    if (value === "none") {
                      field.onChange(undefined);
                    } else {
                      const selectedDoctor = mockDoctors.find(d => d.id?.toString() === value);
                      field.onChange(selectedDoctor);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select consulting doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No doctor selected</SelectItem>
                    {mockDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id?.toString() || ""}>
                        Dr. {doctor.firstname} {doctor.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="scheduleDate"
            label="Schedule Date"
            type="date"
          />

          <div className="space-y-2">
            <Label>Type</Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Controller
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="paymentAmount"
            label="Payment Amount"
            type="number"
          />

          <FormField
            control={form.control}
            name="paymentPaid"
            label="Payment Paid"
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Label>Complaints</Label>
          <Controller
            control={form.control}
            name="complaints"
            render={({ field }) => (
              <Textarea
                placeholder="Enter patient complaints..."
                {...field}
                rows={3}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Controller
            control={form.control}
            name="notes"
            render={({ field }) => (
              <Textarea
                placeholder="Enter additional notes..."
                {...field}
                rows={3}
              />
            )}
          />
        </div>

        {showSubmitButton && (
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : visit ? "Update Visit" : "Create Visit"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
});

VisitForm.displayName = "VisitForm";

export default VisitForm;
