
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import VisitForm, { VisitFormRef } from "./VisitForm";
import FormDialog from "@/components/ui/form-dialog";
import { Visit } from "../types/Visit";

interface VisitFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visit?: Visit) => void;
  visit?: Visit | null;
}

const VisitFormDialog = ({ isOpen, onClose, onSave, visit }: VisitFormDialogProps) => {
  const formRef = useRef<VisitFormRef>(null);

  const handleSuccess = (response: any) => {
    console.log('Form success response:', response);
    // Check if the API response indicates success
    if (response?.status === true || response?.id) {
      // Close dialog and reload visit list on success
      onSave(response.data || response);
      onClose();
    }
    // If status is false, keep dialog open (error message already shown by form)
  };

  const handleSaveClick = () => {
    console.log('Save button clicked, submitting form...');
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
        {visit ? "Update Visit" : "Create Visit"}
      </Button>
    </div>
  );

  console.log('VisitFormDialog render:', { isOpen, visit: visit?.id });

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={visit ? `Edit Visit #${visit.id}` : "Add New Visit"}
      footer={footerButtons}
      maxWidth="max-w-4xl"
    >
      <VisitForm 
        ref={formRef}
        visit={visit}
        onSuccess={handleSuccess}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default VisitFormDialog;
