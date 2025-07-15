
import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/admin/modules/patient/types/Patient";
import PatientService from "@/admin/modules/patient/services/patientService";
import PatientForm from "@/admin/modules/patient/components/PatientForm";

interface PatientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  patient?: Patient | null;
}

const PatientFormDialog = ({ isOpen, onClose, onSave, patient }: PatientFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]" mobileDrawer={true}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {patient ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="flex-1 overflow-y-auto px-6 py-4">
          <PatientForm 
            patient={patient}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogBody>
        <DialogFooter className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormDialog;
