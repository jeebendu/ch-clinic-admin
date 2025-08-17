
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextField from "@/components/form/TextField";
import TextAreaField from "@/components/form/TextAreaField";
import SelectField from "@/components/form/SelectField";
import DoctorSelectField from "@/components/form/DoctorSelectField";
import NumberField from "@/components/form/NumberField";
import { Visit } from "../types/Visit";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";

const visitSchema = z.object({
  type: z.string().min(1, "Visit type is required"),
  referByDoctor: z.any().optional(),
  consultingDoctor: z.any().optional(),
  complaints: z.string().optional(),
  notes: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentAmount: z.number().optional(),
  paymentPaid: z.number().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface VisitFormProps {
  visit?: Visit;
  onSubmit: (data: VisitFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const visitTypeOptions = [
  { value: "routine", label: "Routine" },
  { value: "follow-up", label: "Follow-up" },
  { value: "emergency", label: "Emergency" },
  { value: "consultation", label: "Consultation" },
];

const paymentStatusOptions = [
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "pending", label: "Pending" },
  { value: "unpaid", label: "Unpaid" },
];

const VisitForm: React.FC<VisitFormProps> = ({
  visit,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      type: visit?.type || "",
      referByDoctor: visit?.referByDoctor || null,
      consultingDoctor: visit?.consultingDoctor || null,
      complaints: visit?.complaints || "",
      notes: visit?.notes || "",
      paymentStatus: visit?.paymentStatus || "",
      paymentAmount: visit?.paymentAmount || undefined,
      paymentPaid: visit?.paymentPaid || undefined,
    },
  });

  const handleSubmit = (data: VisitFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              control={form.control}
              name="type"
              label="Visit Type"
              options={visitTypeOptions}
              required
            />

            <DoctorSelectField
              control={form.control}
              name="consultingDoctor"
              label="Consulting Doctor"
            />

            <DoctorSelectField
              control={form.control}
              name="referByDoctor"
              label="Referral Doctor"
            />

            <SelectField
              control={form.control}
              name="paymentStatus"
              label="Payment Status"
              options={paymentStatusOptions}
            />

            <NumberField
              control={form.control}
              name="paymentAmount"
              label="Payment Amount"
              min={0}
              step={0.01}
            />

            <NumberField
              control={form.control}
              name="paymentPaid"
              label="Payment Paid"
              min={0}
              step={0.01}
            />
          </div>

          <TextAreaField
            control={form.control}
            name="complaints"
            label="Complaints"
            rows={4}
            placeholder="Enter patient complaints and symptoms..."
          />

          <TextAreaField
            control={form.control}
            name="notes"
            label="Notes"
            rows={3}
            placeholder="Additional notes..."
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : visit ? "Update Visit" : "Create Visit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VisitForm;
