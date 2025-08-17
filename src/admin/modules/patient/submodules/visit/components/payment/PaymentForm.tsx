
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Visit } from '../../types/Visit';

interface PaymentFormProps {
  visit: Visit;
  onSuccess?: (paymentInfo: any) => void;
  showSubmitButton?: boolean;
}

export interface PaymentFormRef {
  submitForm: () => void;
}

interface PaymentInfo {
  paymentType: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  amount: number;
  transactionId?: string;
  paymentDate: Date;
  notes?: string;
}

const PaymentForm = forwardRef<PaymentFormRef, PaymentFormProps>(({
  visit,
  onSuccess,
  showSubmitButton = true
}, ref) => {
  const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance'>('cash');
  const [amount, setAmount] = useState(visit?.paymentAmount?.toString() || '500');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const paymentInfo: PaymentInfo = {
      paymentType,
      amount: parseFloat(amount),
      transactionId: transactionId || undefined,
      paymentDate: new Date(),
      notes: notes || undefined
    };

    console.log('Processing payment:', paymentInfo);
    
    if (onSuccess) {
      onSuccess(paymentInfo);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="paymentType">Payment Method</Label>
        <Select value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </div>

      {paymentType !== 'cash' && (
        <div>
          <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
          <Input
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes"
        />
      </div>

      {showSubmitButton && (
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            Process Payment
          </Button>
        </div>
      )}
    </form>
  );
});

PaymentForm.displayName = 'PaymentForm';

export default PaymentForm;
