
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { Visit } from '../../types/Visit';
import FormDialog from '@/components/ui/form-dialog';
import PaymentForm, { PaymentFormRef } from './PaymentForm';

interface PaymentDialogProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (paymentInfo: any) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  visit,
  isOpen,
  onClose,
  onPaymentComplete
}) => {
  const formRef = useRef<PaymentFormRef>(null);

  const handleSuccess = (paymentInfo: any) => {
    if (onPaymentComplete) {
      onPaymentComplete(paymentInfo);
    }
    onClose();
  };

  const handleProcessPayment = () => {
    formRef.current?.submitForm();
  };

  const footerButtons = (
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={onClose} className="flex-1">
        Cancel
      </Button>
      <Button type="button" onClick={handleProcessPayment} className="flex-1 bg-green-600 hover:bg-green-700">
        Process Payment
      </Button>
    </div>
  );

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Process Payment
        </div>
      }
      footer={footerButtons}
      maxWidth="w-[80%]"
    >
      <PaymentForm 
        ref={formRef}
        visit={visit}
        onSuccess={handleSuccess}
        showSubmitButton={false}
      />
    </FormDialog>
  );
};

export default PaymentDialog;
