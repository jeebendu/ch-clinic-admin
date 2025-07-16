
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PatientForm, { PatientFormRef } from "@/admin/modules/patient/components/PatientForm";
import FormDialog from "@/components/ui/form-dialog";
import { Loader2 } from "lucide-react";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient?: Patient) => void;
  patientId?: number;
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patientId }: PatientFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<PatientFormRef>(null);

  const handleSave = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Prepare patient data for API
      const patientData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email || "",
        gender: formData.gender,
        age: formData.age,
        address: formData.address || "",
        city: formData.city,
        district: formData.district,
        dob: formData.dob,
        user: {
          email: formData.email || "",
          phone: formData.phone,
          name: `${formData.firstname} ${formData.lastname}`
        }
      };

      let result;
      if (patientId) {
        // Update existing patient - need to get current patient data first
        const currentPatient = await PatientService.getById(patientId);
        const updateData = {
          ...patientData,
          id: patientId,
          uid: currentPatient.data?.uid,
          user: {
            ...currentPatient.data?.user,
            ...patientData.user
          },
        } as Patient;
        result = await PatientService.saveOrUpdate(updateData);
      } else {
        // Create new patient
        result = await PatientService.saveOrUpdate(patientData as Omit<Patient, 'id'>);
      }

      toast({
        title: "Success",
        description: patientId ? "Patient updated successfully." : "Patient created successfully.",
      });

      // Call parent callback with the saved patient data
      onSave(result?.data);
      onClose();
    } catch (error) {
      console.error("Error saving patient:", error);
      toast({
        title: "Error",
        description: patientId ? "Failed to update patient." : "Failed to create patient.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = () => {
    formRef.current?.submitForm();
  };

  const footerButtons = (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleSaveClick}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {patientId ? "Updating..." : "Creating..."}
          </>
        ) : (
          patientId ? "Update Patient" : "Create Patient"
        )}
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={patientId ? "Edit Patient" : "Add New Patient"}
      footer={footerButtons}
    >
      <PatientForm 
        ref={formRef}
        patientId={patientId}
        onSubmit={handleSave}
        isSubmitting={isSubmitting}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PatientFormDialog;
