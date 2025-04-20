
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient } from "../types/Patient";
import { X, Edit, Pencil } from "lucide-react";

interface PatientViewProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onEdit?: () => void;
}

const PatientView: React.FC<PatientViewProps> = ({ isOpen, onClose, patient, onEdit }) => {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Patient Details</span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.gender} · {patient.age} years · {patient.bloodGroup}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
              <p className="text-sm">{patient.phoneNumber}</p>
              <p className="text-sm">{patient.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm">{patient.address}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {patient.status}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          {onEdit && (
            <Button 
              type="button" 
              onClick={onEdit}
              className="gap-1"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientView;
