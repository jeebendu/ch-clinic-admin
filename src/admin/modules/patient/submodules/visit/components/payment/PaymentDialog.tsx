
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Visit } from '../../types/Visit';
import FormDialog from '@/components/ui/form-dialog';
import VisitPayment from './VisitPayment';

interface PaymentDialogProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  visit,
  isOpen,
  onClose
}) => {
  const footerButtons = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Visit Reports
        </div>
      }
      footer={footerButtons}
      maxWidth="max-w-[90vh]"
      maxHeight="max-h-[90vh]"
    >
      <VisitPayment visit={visit} />
    </FormDialog>
  );
};

export default PaymentDialog;
