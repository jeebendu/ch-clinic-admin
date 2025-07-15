
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";
import PatientForm, { PatientFormRef } from "@/admin/modules/patient/components/PatientForm";
import FormDialog from "@/components/ui/form-dialog";
import { Loader2 } from "lucide-react";

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  patient?: Patient | null;
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patient }: PatientFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<PatientFormRef>(null);

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const patientData = {
        ...data,
        user: {
          email: data.email,
          phone: data.phone,
          name: data.firstname + " " + data.lastname
        }
      };

      let editObj = {
        ...patientData,
      } as Patient;

      if (patient?.id) {
        editObj = {
          ...patientData,
          id: patient.id,
          uid: patient.uid,
          user: {
            ...patient.user,
            ...patientData.user
          },
        } as Patient;
      }

      console.log(patientData);
      if (patient?.id) {
        await PatientService.saveOrUpdate({ ...editObj, id: patient.id } as Patient);
        toast({
          title: "Patient updated",
          description: "Patient information has been successfully updated.",
        });
      } else {
        await PatientService.saveOrUpdate(patientData as Omit<Patient, 'id'>);
        toast({
          title: "Patient created",
          description: "New patient has been successfully created.",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: patient ? "Failed to update patient." : "Failed to create patient.",
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
            {patient ? "Updating..." : "Creating..."}
          </>
        ) : (
          patient ? "Update Patient" : "Create Patient"
        )}
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? "Edit Patient" : "Add New Patient"}
      footer={footerButtons}
    >
      <PatientForm 
        ref={formRef}
        patient={patient}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PatientFormDialog;
