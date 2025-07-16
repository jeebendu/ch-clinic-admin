
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PatientForm, { PatientFormRef } from "@/admin/modules/patient/components/PatientForm";
import FormDialog from "@/components/ui/form-dialog";
import { Loader2 } from "lucide-react";
import { Patient } from "@/admin/modules/patient/types/Patient";

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

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // The PatientForm will handle the save/update logic internally
      // We just need to handle the dialog-specific actions
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

  const handlePatientSave = (patient: Patient) => {
    // Call the onSave callback with the patient data
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
        onSave={handlePatientSave}
        isSubmitting={isSubmitting}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PatientFormDialog;
