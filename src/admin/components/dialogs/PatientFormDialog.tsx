import { useRef } from "react";
import { Button } from "@/components/ui/button";
import PatientForm, { PatientFormRef } from "@/admin/modules/patient/components/PatientForm";
import FormDialog from "@/components/ui/form-dialog";
import { Patient } from "@/admin/modules/patient/types/Patient";

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient?: Patient) => void;
  patientId?: number;
  patient?: Patient | null;
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patientId, patient }: PatientFormDialogProps) => {
  const formRef = useRef<PatientFormRef>(null);

  const handleSuccess = (response: any) => {
    // Check if the API response indicates success
    if (response?.status === true) {
      // Close dialog and reload patient list on success
      onSave(response.data || response);
      onClose();
    }
    // If status is false, keep dialog open (error message already shown by form)
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
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleSaveClick}
      >
        {patientId ? "Update Patient" : "Create Patient"}
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
        patient={patient}
        onSuccess={handleSuccess}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PatientFormDialog;
