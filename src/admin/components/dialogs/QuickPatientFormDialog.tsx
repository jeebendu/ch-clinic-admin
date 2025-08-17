
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import QuickPatientForm, { QuickPatientFormRef } from "@/admin/modules/patient/components/QuickPatientForm";
import FormDialog from "@/components/ui/form-dialog";
import { Patient } from "@/admin/modules/patient/types/Patient";

interface QuickPatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

const QuickPatientFormDialog = ({ isOpen, onClose, onSave }: QuickPatientFormDialogProps) => {
  const formRef = useRef<QuickPatientFormRef>(null);

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
        Create Patient
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Patient"
      footer={footerButtons}
      maxWidth="max-w-2xl"
    >
      <QuickPatientForm 
        ref={formRef}
        onSuccess={handleSuccess}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default QuickPatientFormDialog;
