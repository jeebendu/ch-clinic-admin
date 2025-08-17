
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Banknote, Smartphone, Building2, Shield } from 'lucide-react';
import { Visit } from '../../types/Visit';

interface PaymentFormProps {
  visit: Visit;
  outstandingAmount: number;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  visit,
  outstandingAmount,
  onSuccess
}) => {
  const [paymentData, setPaymentData] = useState({
    amount: outstandingAmount,
    paymentMode: '',
    transactionId: '',
    notes: ''
  });

  const paymentModes = [
    { value: 'cash', label: 'Cash', icon: Banknote },
    { value: 'card', label: 'Card', icon: CreditCard },
    { value: 'upi', label: 'UPI', icon: Smartphone },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
    { value: 'insurance', label: 'Insurance', icon: Shield }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing payment:', paymentData);
    // TODO: Implement actual payment processing
    onSuccess();
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setPaymentData(prev => ({
      ...prev,
      amount: Math.min(numValue, outstandingAmount)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Collection</CardTitle>
        <div className="text-sm text-gray-600">
          Outstanding Amount: ₹{outstandingAmount.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              max={outstandingAmount}
              value={paymentData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select
              value={paymentData.paymentMode}
              onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMode: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {mode.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {paymentData.paymentMode && paymentData.paymentMode !== 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={paymentData.transactionId}
                onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes about this payment"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!paymentData.paymentMode || paymentData.amount <= 0}
            >
              Collect Payment (₹{paymentData.amount.toFixed(2)})
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
