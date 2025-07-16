
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
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patientId }: PatientFormDialogProps) => {
  const formRef = useRef<PatientFormRef>(null);

  const handleSuccess = (patient: Patient) => {
    onSave(patient);
    onClose();
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
        onSuccess={handleSuccess}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PatientFormDialog;
