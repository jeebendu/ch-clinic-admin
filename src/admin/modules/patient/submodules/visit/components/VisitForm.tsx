
import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { 
  InputField, 
  PhoneField, 
  FormRow,
  FormSection 
} from "@/components/form";
import PatientPicker from "@/admin/modules/patient/components/PatientPicker";
import QuickPatientFormDialog from "@/admin/components/dialogs/QuickPatientFormDialog";
import DoctorAutocomplete from "@/admin/modules/doctor/components/DoctorAutocomplete";
import visitService from "../services/visitService";
import { Visit } from "../types/Visit";
import { Patient } from "@/admin/modules/patient/types/Patient";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { useToast } from "@/hooks/use-toast";

const visitSchema = z.object({
  patient: z.object({
    id: z.number(),
  }).nullable(),
  complaints: z.string().min(1, "Complaints are required"),
  scheduleDate: z.string().min(1, "Schedule date is required"),
  type: z.string().min(1, "Visit type is required"),
  status: z.string().default("Scheduled"),
  notes: z.string().optional(),
  referralDoctorName: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

export interface VisitFormRef {
  submitForm: () => void;
  resetForm: () => void;
}

interface VisitFormProps {
  visit?: Visit | null;
  onSuccess: (response: any) => void;
  onError?: (error: string) => void;
  showSubmitButton?: boolean;
}

const VisitForm = forwardRef<VisitFormRef, VisitFormProps>(
  ({ visit, onSuccess, onError, showSubmitButton = true }, ref) => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedReferralDoctor, setSelectedReferralDoctor] = useState<Doctor | null>(null);
    const [selectedConsultingDoctor, setSelectedConsultingDoctor] = useState<Doctor | null>(null);
    const [showQuickPatientDialog, setShowQuickPatientDialog] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<VisitFormData>({
      resolver: zodResolver(visitSchema),
      defaultValues: {
        patient: null,
        complaints: "",
        scheduleDate: "",
        type: "Consultation",
        status: "Scheduled",
        notes: "",
        referralDoctorName: "",
      },
    });

    // Load visit data when editing
    useEffect(() => {
      if (visit) {
        setSelectedPatient(visit.patient || null);
        setSelectedReferralDoctor(visit.referByDoctor || null);
        setSelectedConsultingDoctor(visit.consultingDoctor || null);
        form.reset({
          patient: visit.patient ? { id: visit.patient.id } : null,
          complaints: visit.complaints || "",
          scheduleDate: visit.scheduleDate || "",
          type: visit.type || "Consultation",
          status: visit.status || "Scheduled",
          notes: visit.notes || "",
          referralDoctorName: visit.referralDoctorName || "",
        });
      }
    }, [visit, form]);

    // Update form when patient is selected
    useEffect(() => {
      if (selectedPatient) {
        form.setValue("patient", { id: selectedPatient.id });
      } else {
        form.setValue("patient", null);
      }
    }, [selectedPatient, form]);

    const onSubmit = async (data: VisitFormData) => {
      if (!selectedPatient) {
        toast({
          title: "Error",
          description: "Please select a patient",
          variant: "destructive",
        });
        return;
      }

      try {
        const visitData = {
          ...data,
          id: visit?.id,
          patient: selectedPatient,
          referByDoctor: selectedReferralDoctor,
          consultingDoctor: selectedConsultingDoctor,
        };

        const response = await visitService.saveOrUpdate(visitData);
        
        if (response?.data?.status === true || response?.status === true) {
          toast({
            title: "Success",
            description: visit ? "Visit updated successfully" : "Visit created successfully",
          });
          onSuccess(response.data || response);
        } else {
          const errorMessage = response?.data?.message || response?.message || "Failed to save visit";
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          onError?.(errorMessage);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error.message || "Failed to save visit";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        onError?.(errorMessage);
      }
    };

    const handlePatientCreated = (patient: Patient) => {
      setSelectedPatient(patient);
      toast({
        title: "Success",
        description: "Patient created and selected for visit",
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(onSubmit)();
      },
      resetForm: () => {
        form.reset();
        setSelectedPatient(null);
        setSelectedReferralDoctor(null);
        setSelectedConsultingDoctor(null);
      },
    }));

    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="Patient Selection">
              <PatientPicker
                selectedPatient={selectedPatient}
                onPatientSelect={setSelectedPatient}
                onAddNewPatient={() => setShowQuickPatientDialog(true)}
              />
            </FormSection>

            <FormSection title="Visit Details">
              <FormRow columns={2}>
                <DoctorAutocomplete
                  selectedDoctor={selectedReferralDoctor}
                  onDoctorSelect={setSelectedReferralDoctor}
                  placeholder="Search referral doctor..."
                  allowExternal={true}
                  label="Referral Doctor"
                />
                <DoctorAutocomplete
                  selectedDoctor={selectedConsultingDoctor}
                  onDoctorSelect={setSelectedConsultingDoctor}
                  placeholder="Search consulting doctor..."
                  allowExternal={false}
                  label="Consulting Doctor"
                />
              </FormRow>

              <FormRow columns={2}>
                <InputField
                  control={form.control}
                  name="scheduleDate"
                  label="Schedule Date"
                  type="datetime-local"
                  required
                />
                <InputField
                  control={form.control}
                  name="type"
                  label="Visit Type"
                  required
                />
              </FormRow>

              <InputField
                control={form.control}
                name="complaints"
                label="Complaints"
                required
                placeholder="Describe the patient's complaints..."
              />

              <FormRow columns={2}>
                <InputField
                  control={form.control}
                  name="status"
                  label="Status"
                />
                <InputField
                  control={form.control}
                  name="referralDoctorName"
                  label="Referral Doctor Name (Manual)"
                  placeholder="Optional manual referral doctor name"
                />
              </FormRow>

              <InputField
                control={form.control}
                name="notes"
                label="Additional Notes"
                placeholder="Any additional notes about the visit..."
              />
            </FormSection>

            {showSubmitButton && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting 
                    ? "Saving..." 
                    : visit ? "Update Visit" : "Create Visit"
                  }
                </Button>
              </div>
            )}
          </form>
        </Form>

        <QuickPatientFormDialog
          isOpen={showQuickPatientDialog}
          onClose={() => setShowQuickPatientDialog(false)}
          onSave={handlePatientCreated}
        />
      </>
    );
  }
);

VisitForm.displayName = "VisitForm";

export default VisitForm;
