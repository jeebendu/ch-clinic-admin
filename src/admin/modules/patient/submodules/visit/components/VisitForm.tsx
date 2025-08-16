
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Visit } from "../types/Visit";
import visitService from "../services/visitService";

// Mock services for development
const mockPatients = [
  { id: 1, firstname: "John", lastname: "Doe", age: 35, gender: "Male", uid: "P001" },
  { id: 2, firstname: "Jane", lastname: "Smith", age: 28, gender: "Female", uid: "P002" },
  { id: 3, firstname: "Bob", lastname: "Johnson", age: 45, gender: "Male", uid: "P003" },
];

const mockDoctors = [
  { id: 1, firstname: "Dr. Sarah", lastname: "Wilson", specializationList: ["Cardiology"] },
  { id: 2, firstname: "Dr. Michael", lastname: "Brown", specializationList: ["Neurology"] },
  { id: 3, firstname: "Dr. Emily", lastname: "Davis", specializationList: ["Pediatrics"] },
];

const mockBranches = [
  { id: 1, name: "Main Branch", code: "MAIN", location: "Downtown" },
  { id: 2, name: "North Branch", code: "NORTH", location: "North Side" },
  { id: 3, name: "South Branch", code: "SOUTH", location: "South Side" },
];

const visitFormSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  consultingDoctorId: z.string().min(1, "Consulting doctor is required"),
  referByDoctorId: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
  complaints: z.string().min(1, "Complaints/reason is required"),
  scheduleDate: z.string().min(1, "Schedule date is required"),
  type: z.string().min(1, "Visit type is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentAmount: z.string().optional(),
  paymentPaid: z.string().optional(),
  referralDoctorName: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitFormSchema>;

export interface VisitFormRef {
  submitForm: () => void;
}

interface VisitFormProps {
  visit?: Visit | null;
  onSuccess?: (visit: Visit) => void;
  showSubmitButton?: boolean;
}

const VisitForm = forwardRef<VisitFormRef, VisitFormProps>(
  ({ visit, onSuccess, showSubmitButton = true }, ref) => {
    console.log('VisitForm render - visit:', visit);
    
    const form = useForm<VisitFormData>({
      resolver: zodResolver(visitFormSchema),
      defaultValues: {
        patientId: visit?.patient?.id?.toString() || "",
        consultingDoctorId: visit?.consultingDoctor?.id?.toString() || "",
        referByDoctorId: visit?.referByDoctor?.id?.toString() || "",
        branchId: visit?.branch?.id?.toString() || "",
        complaints: visit?.complaints || "",
        scheduleDate: visit?.scheduleDate || "",
        type: visit?.type || "",
        status: visit?.status || "",
        notes: visit?.notes || "",
        paymentStatus: visit?.paymentStatus || "",
        paymentAmount: visit?.paymentAmount?.toString() || "",
        paymentPaid: visit?.paymentPaid?.toString() || "",
        referralDoctorName: visit?.referralDoctorName || "",
      },
    });

    // Update form values when visit prop changes
    useEffect(() => {
      if (visit) {
        console.log('Updating form with visit data:', visit);
        form.reset({
          patientId: visit.patient?.id?.toString() || "",
          consultingDoctorId: visit.consultingDoctor?.id?.toString() || "",
          referByDoctorId: visit.referByDoctor?.id?.toString() || "",
          branchId: visit.branch?.id?.toString() || "",
          complaints: visit.complaints || "",
          scheduleDate: visit.scheduleDate || "",
          type: visit.type || "",
          status: visit.status || "",
          notes: visit.notes || "",
          paymentStatus: visit.paymentStatus || "",
          paymentAmount: visit.paymentAmount?.toString() || "",
          paymentPaid: visit.paymentPaid?.toString() || "",
          referralDoctorName: visit.referralDoctorName || "",
        });
      }
    }, [visit, form]);

    const onSubmit = async (data: VisitFormData) => {
      try {
        console.log('Submitting visit form:', data);
        
        // Transform form data to Visit object
        const visitData: Visit = {
          id: visit?.id,
          patient: mockPatients.find(p => p.id.toString() === data.patientId),
          consultingDoctor: mockDoctors.find(d => d.id.toString() === data.consultingDoctorId),
          referByDoctor: data.referByDoctorId ? mockDoctors.find(d => d.id.toString() === data.referByDoctorId) : undefined,
          branch: mockBranches.find(b => b.id.toString() === data.branchId),
          complaints: data.complaints,
          scheduleDate: data.scheduleDate,
          type: data.type,
          status: data.status,
          notes: data.notes,
          paymentStatus: data.paymentStatus,
          paymentAmount: data.paymentAmount ? parseFloat(data.paymentAmount) : undefined,
          paymentPaid: data.paymentPaid ? parseFloat(data.paymentPaid) : undefined,
          referralDoctorName: data.referralDoctorName,
          createdTime: visit?.createdTime || new Date().toISOString(),
        };

        const response = await visitService.saveOrUpdate(visitData);
        console.log('Visit save response:', response);
        
        toast.success(visit ? "Visit updated successfully!" : "Visit created successfully!");
        
        if (onSuccess) {
          onSuccess(response.data || response);
        }
      } catch (error) {
        console.error('Error saving visit:', error);
        toast.error("Failed to save visit. Please try again.");
      }
    };

    const handleSubmit = () => {
      console.log('Handle submit called');
      form.handleSubmit(onSubmit)();
    };

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Selection */}
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select patient</SelectItem>
                      {mockPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.firstname} {patient.lastname} ({patient.uid})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Branch Selection */}
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select branch</SelectItem>
                      {mockBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.name} ({branch.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consulting Doctor */}
            <FormField
              control={form.control}
              name="consultingDoctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consulting Doctor *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consulting doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select consulting doctor</SelectItem>
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.firstname} {doctor.lastname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referring Doctor */}
            <FormField
              control={form.control}
              name="referByDoctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referring Doctor</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select referring doctor (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.firstname} {doctor.lastname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Date */}
            <FormField
              control={form.control}
              name="scheduleDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visit Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Type *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select visit type</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Status */}
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Amount */}
            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Paid */}
            <FormField
              control={form.control}
              name="paymentPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Doctor Name */}
            <FormField
              control={form.control}
              name="referralDoctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Doctor Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="External referral doctor name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Complaints */}
          <FormField
            control={form.control}
            name="complaints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complaints/Reason for Visit *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the patient's complaints or reason for visit"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the visit"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showSubmitButton && (
            <div className="flex justify-end space-x-4">
              <Button type="submit">
                {visit ? "Update Visit" : "Create Visit"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    );
  }
);

VisitForm.displayName = "VisitForm";

export default VisitForm;
