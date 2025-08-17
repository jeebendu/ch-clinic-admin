
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Smartphone, Building, Shield } from 'lucide-react';
import { Visit } from '../../types/Visit';

interface PaymentFormProps {
  visit: Visit;
  outstandingAmount?: number;
  onSuccess?: () => void;
  showSubmitButton?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  visit, 
  outstandingAmount = 0,
  onSuccess,
  showSubmitButton = true 
}) => {
  const [paymentData, setPaymentData] = useState({
    amount: outstandingAmount,
    paymentMode: '',
    transactionId: '',
    notes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const paymentModes = [
    { value: 'cash', label: 'Cash', icon: Wallet },
    { value: 'card', label: 'Debit/Credit Card', icon: CreditCard },
    { value: 'upi', label: 'UPI', icon: Smartphone },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: Building },
    { value: 'insurance', label: 'Insurance', icon: Shield }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Payment processed:', {
        visitId: visit.id,
        ...paymentData
      });

      onSuccess?.();
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentModeIcon = (mode: string) => {
    const modeConfig = paymentModes.find(pm => pm.value === mode);
    if (!modeConfig) return null;
    const IconComponent = modeConfig.icon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Patient</Label>
              <p className="font-medium">{visit.patient?.firstname} {visit.patient?.lastname}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Visit Date</Label>
              <p className="font-medium">{new Date(visit.appointmentDate || '').toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Outstanding Amount</Label>
              <p className="text-xl font-bold text-red-600">₹{outstandingAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Status</Label>
              <Badge className="bg-yellow-100 text-yellow-800">
                Partial Payment
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Collect Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Amount */}
            <div>
              <Label htmlFor="amount">Payment Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={outstandingAmount}
                value={paymentData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="Enter amount"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ₹{outstandingAmount.toFixed(2)}
              </p>
            </div>

            {/* Payment Mode */}
            <div>
              <Label htmlFor="paymentMode">Payment Mode *</Label>
              <Select 
                value={paymentData.paymentMode} 
                onValueChange={(value) => handleInputChange('paymentMode', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode">
                    {paymentData.paymentMode && (
                      <div className="flex items-center gap-2">
                        {getPaymentModeIcon(paymentData.paymentMode)}
                        {paymentModes.find(pm => pm.value === paymentData.paymentMode)?.label}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => {
                    const IconComponent = mode.icon;
                    return (
                      <SelectItem key={mode.value} value={mode.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {mode.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Transaction ID (conditional) */}
            {paymentData.paymentMode && paymentData.paymentMode !== 'cash' && (
              <div>
                <Label htmlFor="transactionId">
                  Transaction ID {paymentData.paymentMode === 'insurance' ? '' : '*'}
                </Label>
                <Input
                  id="transactionId"
                  value={paymentData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  placeholder="Enter transaction/reference ID"
                  required={paymentData.paymentMode !== 'insurance'}
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={paymentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about this payment"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        {showSubmitButton && (
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={!paymentData.amount || !paymentData.paymentMode || isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `Collect ₹${paymentData.amount.toFixed(2)}`
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
