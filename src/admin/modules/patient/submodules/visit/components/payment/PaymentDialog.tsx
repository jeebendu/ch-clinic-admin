
import React from "react";
import FormDialog from "@/admin/components/dialogs/FormDialog";
import { Button } from "@/components/ui/button";
import { Visit } from "../../types/Visit";
import PaymentForm from "./PaymentForm";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit;
  outstandingAmount?: number;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  visit,
  outstandingAmount = 0
}) => {
  const handlePaymentSuccess = () => {
    onClose();
  };

  const footerButtons = (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Payment"
      footer={footerButtons}
      maxWidth="w-[80%]"
      maxHeight="max-h-[90vh]"
    >
      <PaymentForm 
        visit={visit} 
        outstandingAmount={outstandingAmount}
        onSuccess={handlePaymentSuccess}
      />
    </FormDialog>
  );
};

export default PaymentDialog;
