
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PatientForm, { PatientFormRef } from "@/admin/modules/patient/components/PatientForm";
import FormDialog from "@/components/ui/form-dialog";
import { Loader2 } from "lucide-react";

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  patientId?: number;
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patientId }: PatientFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<PatientFormRef>(null);

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // The PatientForm will handle the save/update logic internally
      // We just need to handle the dialog-specific actions
      onSave();
      onClose();
      toast({
        title: "Success",
        description: patientId ? "Patient updated successfully." : "Patient created successfully.",
      });
    } catch (error) {
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
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PatientFormDialog;
