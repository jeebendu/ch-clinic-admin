
import React from "react";
import FormDialog from "@/components/ui/form-dialog";
import { VisitDetailsContent } from "./VisitDetailsContent";
import { Visit } from "../types/Visit";
import { Button } from "@/components/ui/button";
import { Edit, Receipt, FileText, X } from "lucide-react";

interface VisitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  onEdit?: (visit: Visit) => void;
  onGenerateInvoice?: (visit: Visit) => void;
  onViewPrescription?: (visit: Visit) => void;
}

export const VisitDetailsModal: React.FC<VisitDetailsModalProps> = ({
  isOpen,
  onClose,
  visit,
  onEdit,
  onGenerateInvoice,
  onViewPrescription
}) => {
  if (!visit) return null;

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2">
        {onEdit && (
          <Button onClick={() => onEdit(visit)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Visit
          </Button>
        )}
        {onGenerateInvoice && (
          <Button onClick={() => onGenerateInvoice(visit)} variant="outline" size="sm">
            <Receipt className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        )}
        {onViewPrescription && (
          <Button onClick={() => onViewPrescription(visit)} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Prescription
          </Button>
        )}
      </div>
      <Button onClick={onClose} variant="outline" size="sm">
        <X className="h-4 w-4 mr-2" />
        Close
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Visit Details - ${visit.patient?.firstname} ${visit.patient?.lastname}`}
      footer={footer}
      maxWidth="max-w-4xl"
      maxHeight="max-h-[90vh]"
    >
      <VisitDetailsContent visit={visit} />
    </FormDialog>
  );
};
