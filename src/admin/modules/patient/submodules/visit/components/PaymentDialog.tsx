
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import FormDialog from '@/components/ui/form-dialog';
import { DollarSign, Plus, Trash2, Receipt, CreditCard } from 'lucide-react';
import { Visit } from '../types/Visit';

interface PaymentDialogProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentOrderItem {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid';
}

interface PaymentTransaction {
  id: string;
  amount: number;
  mode: string;
  date: string;
  collectedBy: string;
  referenceNumber?: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ visit, isOpen, onClose }) => {
  const [orderItems, setOrderItems] = useState<PaymentOrderItem[]>([
    {
      id: '1',
      type: 'consultation',
      description: 'Consultation',
      amount: 500,
      status: 'paid'
    },
    {
      id: '2',
      type: 'lab',
      description: 'Blood Test',
      amount: 300,
      status: 'pending'
    },
    {
      id: '3',
      type: 'lab',
      description: 'X-Ray',
      amount: 700,
      status: 'pending'
    }
  ]);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: '1',
      amount: 500,
      mode: 'cash',
      date: '16-Aug-25',
      collectedBy: 'Staff A',
      referenceNumber: ''
    },
    {
      id: '2',
      amount: 1000,
      mode: 'upi',
      date: '17-Aug-25',
      collectedBy: 'Staff A',
      referenceNumber: 'UPI12345'
    }
  ]);

  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const totalDue = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = totalDue - totalPaid;

  const handleRemoveItem = (id: string) => {
    setOrderItems(items => items.filter(item => item.id !== id));
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(transactions => transactions.filter(t => t.id !== id));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <FormDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Payment Management"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Due</div>
              <div className="text-2xl font-bold">₹{totalDue}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Paid</div>
              <div className="text-2xl font-bold text-green-600">₹{totalPaid}</div>
            </div>
            <div className={`p-4 rounded-lg ${balance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="text-sm text-muted-foreground">Balance</div>
              <div className={`text-2xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{balance}
              </div>
            </div>
          </div>

          {/* Payment Order (Line Items) - Top Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Payment Order (Line Items)
                </div>
                <Button 
                  onClick={() => setAddItemOpen(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-center py-2">Status</th>
                      <th className="text-center py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">{item.description}</td>
                        <td className="py-3 capitalize">{item.type}</td>
                        <td className="py-3 text-right font-medium">₹{item.amount}</td>
                        <td className="py-3 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td colSpan={2} className="py-3">Total Due:</td>
                      <td className="py-3 text-right text-lg">₹{totalDue}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payments (Transactions) - Bottom Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payments (Transactions)
                </div>
                <Button 
                  onClick={() => setAddPaymentOpen(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Payment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-left py-2">Mode</th>
                      <th className="text-left py-2">Collected By</th>
                      <th className="text-left py-2">Reference</th>
                      <th className="text-center py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3">{transaction.date}</td>
                        <td className="py-3 text-right font-medium">₹{transaction.amount}</td>
                        <td className="py-3 capitalize">{transaction.mode}</td>
                        <td className="py-3">{transaction.collectedBy}</td>
                        <td className="py-3">{transaction.referenceNumber || '-'}</td>
                        <td className="py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td className="py-3">Total Paid:</td>
                      <td className="py-3 text-right text-lg">₹{totalPaid}</td>
                      <td colSpan={4}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </FormDialog>

      <AddItemDialog
        isOpen={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onAdd={(item) => {
          setOrderItems(items => [...items, { ...item, id: Date.now().toString() }]);
          setAddItemOpen(false);
        }}
      />

      <AddPaymentDialog
        isOpen={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        onAdd={(payment) => {
          setTransactions(transactions => [...transactions, { ...payment, id: Date.now().toString() }]);
          setAddPaymentOpen(false);
        }}
      />
    </>
  );
};

// Add Item Dialog Component
const AddItemDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<PaymentOrderItem, 'id'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && type && amount) {
      onAdd({
        description,
        type,
        amount: parseFloat(amount),
        status
      });
      // Reset form
      setDescription('');
      setType('');
      setAmount('');
      setStatus('pending');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Line Item</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Item Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Consultation, Blood Test"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'pending' | 'paid') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Payment Dialog Component
const AddPaymentDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: Omit<PaymentTransaction, 'id'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('');
  const [collectedBy, setCollectedBy] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && mode && collectedBy) {
      onAdd({
        amount: parseFloat(amount),
        mode,
        collectedBy,
        referenceNumber,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit'
        })
      });
      // Reset form
      setAmount('');
      setMode('');
      setCollectedBy('');
      setReferenceNumber('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="mode">Payment Mode</Label>
              <Select value={mode} onValueChange={setMode} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="collectedBy">Collected By</Label>
              <Input
                id="collectedBy"
                value={collectedBy}
                onChange={(e) => setCollectedBy(e.target.value)}
                placeholder="Staff name"
                required
              />
            </div>

            <div>
              <Label htmlFor="referenceNumber">Reference Number (Optional)</Label>
              <Input
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Transaction ID, Cheque number, etc."
              />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Add Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
