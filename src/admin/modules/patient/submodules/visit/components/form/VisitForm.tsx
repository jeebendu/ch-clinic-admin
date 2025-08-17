
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
  FormSection, 
  TextAreaField
} from "@/components/form";
import PatientPicker from "@/admin/modules/patient/components/PatientPicker";
import QuickPatientFormDialog from "@/admin/components/dialogs/QuickPatientFormDialog";
import DoctorAutocomplete from "@/admin/modules/doctor/components/DoctorAutocomplete";
import { Patient } from "@/admin/modules/patient/types/Patient";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { useToast } from "@/hooks/use-toast";
import SelectField from "@/components/form/SelectField";
import { Visit } from "../../types/Visit";
import visitService from "../../services/visitService";
import { VISIT_TYPE_OPTIONS } from "../../types/VisitFilter";

const visitSchema = z.object({
  patient: z.object({
    id: z.number(),
  }).nullable().refine((val) => val !== null, {
    message: "Patient selection is required"
  }),
  complaints: z.string().min(1, "Complaints are required"),
  type: z.string().min(1, "Visit type is required"),
  status: z.string().default("Scheduled"),
  notes: z.string().optional(),
  referralDoctorName: z.string().optional(),
  historyOf: z.string().optional(),
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
    const [validationErrors, setValidationErrors] = useState<{
      patient?: string;
      referByDoctor?: string;
      consultingDoctor?: string;
    }>({});
    const { toast } = useToast();
    
    const form = useForm<VisitFormData>({
      resolver: zodResolver(visitSchema),
      defaultValues: {
        patient: null,
        complaints: "",
        type: "Consultation",
        status: "Scheduled",
        notes: "",
        referralDoctorName: "",
        historyOf: "",
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
          type: visit.type || "Consultation",
          status: visit.status || "Scheduled",
          notes: visit.notes || "",
          referralDoctorName: visit.referralDoctorName || "",
          historyOf: visit.historyOf || "",
        });
      }
    }, [visit, form]);

    // Update form when patient is selected
    useEffect(() => {
      if (selectedPatient) {
        form.setValue("patient", { id: selectedPatient.id });
        setValidationErrors(prev => ({ ...prev, patient: undefined }));
      } else {
        form.setValue("patient", null);
      }
    }, [selectedPatient, form]);

    // Clear validation errors when doctors are selected
    useEffect(() => {
      if (selectedReferralDoctor) {
        setValidationErrors(prev => ({ ...prev, referByDoctor: undefined }));
      }
    }, [selectedReferralDoctor]);

    useEffect(() => {
      if (selectedConsultingDoctor) {
        setValidationErrors(prev => ({ ...prev, consultingDoctor: undefined }));
      }
    }, [selectedConsultingDoctor]);

    const validateExternalComponents = () => {
      const errors: typeof validationErrors = {};
      let isValid = true;

      // Validate patient selection
      if (!selectedPatient) {
        errors.patient = "Patient selection is required";
        isValid = false;
      }

      // Validate consulting doctor selection (required)
      if (!selectedConsultingDoctor) {
        errors.consultingDoctor = "Consulting doctor selection is required";
        isValid = false;
      }

      // Referral doctor is optional, so no validation needed

      setValidationErrors(errors);
      return isValid;
    };

    const onSubmit = async (data: VisitFormData) => {
      // Validate external components first
      if (!validateExternalComponents()) {
        toast({
          title: "Validation Error",
          description: "Please fix the validation errors and try again",
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
        
        if (response?.data?.status === true) {
          toast({
            title: "Success",
            description: visit ? "Visit updated successfully" : "Visit created successfully",
          });
          onSuccess(response.data || response);
        } else {
          const errorMessage = response?.data?.message|| "Failed to save visit";
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
        setValidationErrors({});
      },
    }));

    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="Patient Selection">
              <div className="space-y-2">
                <PatientPicker
                  selectedPatient={selectedPatient}
                  onPatientSelect={setSelectedPatient}
                  onAddNewPatient={() => setShowQuickPatientDialog(true)}
                />
                {validationErrors.patient && (
                  <p className="text-sm font-medium text-destructive">
                    {validationErrors.patient}
                  </p>
                )}
              </div>
            </FormSection>

            <FormSection title="Visit Details">
              <FormRow columns={2}>
                <div className="space-y-2">
                  <DoctorAutocomplete
                    selectedDoctor={selectedReferralDoctor}
                    onDoctorSelect={setSelectedReferralDoctor}
                    placeholder="Search referral doctor..."
                    allowExternal={true}
                    label="Referral Doctor"
                  />
                  {validationErrors.referByDoctor && (
                    <p className="text-sm font-medium text-destructive">
                      {validationErrors.referByDoctor}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <DoctorAutocomplete
                    selectedDoctor={selectedConsultingDoctor}
                    onDoctorSelect={setSelectedConsultingDoctor}
                    placeholder="Search consulting doctor..."
                    allowExternal={false}
                    label="Consulting Doctor *"
                  />
                  {validationErrors.consultingDoctor && (
                    <p className="text-sm font-medium text-destructive">
                      {validationErrors.consultingDoctor}
                    </p>
                  )}
                </div>
              </FormRow>

              <FormRow columns={2}>
                <SelectField
                  control={form.control}
                  name="type"
                  label="Visit Type"
                  options={VISIT_TYPE_OPTIONS}
                  required
                />
              </FormRow>

              <TextAreaField
                control={form.control}
                name="complaints"
                label="Complaints"
                rows={4}
                placeholder="Enter patient complaints and symptoms..."
              />

              <TextAreaField
                control={form.control}
                name="historyOf"
                label="History Of"
                rows={4}
                placeholder="Enter patient History..."
              />
            </FormSection>

            {showSubmitButton && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedPatient(null);
                    setSelectedReferralDoctor(null);
                    setSelectedConsultingDoctor(null);
                    setValidationErrors({});
                  }}
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
