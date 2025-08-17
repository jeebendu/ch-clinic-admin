import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Plus } from 'lucide-react';
import { Visit } from '../modules/patient/submodules/visit/types/Visit';

interface PaymentDialogProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentOrderItem {
  id?: string;
  type: 'consultation' | 'lab' | 'report' | 'medicine' | 'other';
  description: string;
  amount: number;
  status: 'pending' | 'paid';
}

interface PaymentTransaction {
  amount: number;
  mode: 'cash' | 'upi' | 'card' | 'bank_transfer';
  referenceNumber?: string;
  notes?: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  visit,
  isOpen,
  onClose
}) => {
  const [orderItems, setOrderItems] = useState<PaymentOrderItem[]>([
    {
      id: '1',
      type: 'consultation',
      description: 'Consultation Fee',
      amount: 500,
      status: 'pending'
    }
  ]);

  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [currentPayment, setCurrentPayment] = useState<PaymentTransaction>({
    amount: 0,
    mode: 'cash',
    referenceNumber: '',
    notes: ''
  });

  const [newItem, setNewItem] = useState<Partial<PaymentOrderItem>>({
    type: 'lab',
    description: '',
    amount: 0
  });

  const totalDue = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = totalDue - totalPaid;

  const handleAddOrderItem = () => {
    if (newItem.description && newItem.amount && newItem.amount > 0) {
      setOrderItems([
        ...orderItems,
        {
          id: Date.now().toString(),
          type: newItem.type as PaymentOrderItem['type'],
          description: newItem.description,
          amount: newItem.amount,
          status: 'pending'
        }
      ]);
      setNewItem({ type: 'lab', description: '', amount: 0 });
    }
  };

  const handleAddPayment = () => {
    if (currentPayment.amount > 0 && currentPayment.amount <= balance) {
      setPayments([...payments, { ...currentPayment }]);
      setCurrentPayment({
        amount: 0,
        mode: 'cash',
        referenceNumber: '',
        notes: ''
      });
    }
  };

  const handleSave = () => {
    // Here you would save the payment order items and transactions
    console.log('Payment Order Items:', orderItems);
    console.log('Payment Transactions:', payments);
    console.log('Visit ID:', visit?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Payment & Invoice Management
            {visit && (
              <span className="text-sm text-muted-foreground ml-2">
                Visit ID: {visit.id} | Patient: {visit.patient?.firstName} {visit.patient?.lastName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Order Items</h3>
            
            {/* Existing Items */}
            <div className="space-y-2">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-muted-foreground capitalize">{item.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{item.amount}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Add New Item</h4>
              <div className="space-y-3">
                <div>
                  <Label>Type</Label>
                  <Select value={newItem.type} onValueChange={(value) => setNewItem({...newItem, type: value as PaymentOrderItem['type']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="lab">Lab Test</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={newItem.amount || ''}
                    onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value) || 0})}
                    placeholder="Enter amount"
                  />
                </div>
                <Button onClick={handleAddOrderItem} className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Transactions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Transactions</h3>
            
            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between text-sm">
                <span>Total Due:</span>
                <span className="font-medium">₹{totalDue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Paid:</span>
                <span className="font-medium text-green-600">₹{totalPaid}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                <span>Balance:</span>
                <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                  ₹{balance}
                </span>
              </div>
            </div>

            {/* Previous Payments */}
            {payments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Previous Payments</h4>
                {payments.map((payment, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">₹{payment.amount}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {payment.mode}
                          {payment.referenceNumber && ` - ${payment.referenceNumber}`}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Payment */}
            {balance > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Collect Payment</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={currentPayment.amount || ''}
                      onChange={(e) => setCurrentPayment({...currentPayment, amount: parseFloat(e.target.value) || 0})}
                      placeholder={`Max: ₹${balance}`}
                      max={balance}
                    />
                  </div>
                  <div>
                    <Label>Payment Mode</Label>
                    <Select value={currentPayment.mode} onValueChange={(value) => setCurrentPayment({...currentPayment, mode: value as PaymentTransaction['mode']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {currentPayment.mode !== 'cash' && (
                    <div>
                      <Label>Reference Number</Label>
                      <Input
                        value={currentPayment.referenceNumber || ''}
                        onChange={(e) => setCurrentPayment({...currentPayment, referenceNumber: e.target.value})}
                        placeholder="Transaction/Reference ID"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Notes (Optional)</Label>
                    <Textarea
                      value={currentPayment.notes || ''}
                      onChange={(e) => setCurrentPayment({...currentPayment, notes: e.target.value})}
                      placeholder="Additional notes"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddPayment} className="w-full bg-green-600 hover:bg-green-700">
                    Collect Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Save & Generate Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
