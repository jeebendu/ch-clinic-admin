import { useRef } from "react";
import { Button } from "@/components/ui/button";
import FormDialog from "@/components/ui/form-dialog";
import { Visit } from "../../types/Visit";
import VisitForm, { VisitFormRef } from "../form/VisitForm";

interface VisitFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visit?: Visit) => void;
  visit?: Visit | null;
}

const VisitFormDialog = ({ isOpen, onClose, onSave, visit }: VisitFormDialogProps) => {
  const formRef = useRef<VisitFormRef>(null);

  const handleSuccess = (response: any) => {
    // Check if the API response indicates success
    if (response?.status === true) {
      // Close dialog and reload visit list on success
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
        {visit ? "Update Visit" : "Create Visit"}
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={visit ? "Edit Visit" : "Add New Visit"}
      footer={footerButtons}
      maxWidth="w-[80%]"
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
