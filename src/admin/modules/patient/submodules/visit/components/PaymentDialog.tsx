
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Visit } from '@/admin/modules/patient/submodules/visit/types/Visit';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Receipt, CreditCard, Trash2 } from 'lucide-react';

interface PaymentOrderItem {
  id: string;
  type: 'consultation' | 'lab' | 'report' | 'medicine' | 'procedure';
  item: string;
  amount: number;
  status: 'paid' | 'pending' | 'partial';
}

interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  mode: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'insurance';
  collectedBy: string;
  reference?: string;
}

interface PaymentDialogProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ visit, isOpen, onClose }) => {
  // Payment Order Items
  const [orderItems, setOrderItems] = useState<PaymentOrderItem[]>([
    {
      id: '1',
      type: 'consultation',
      item: 'Consultation',
      amount: 500,
      status: 'paid'
    },
    {
      id: '2',
      type: 'lab',
      item: 'Blood Test',
      amount: 300,
      status: 'pending'
    },
    {
      id: '3',
      type: 'lab',
      item: 'X-Ray',
      amount: 700,
      status: 'pending'
    }
  ]);

  // Payment Transactions
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: '1',
      date: '16-Aug-25',
      amount: 500,
      mode: 'cash',
      collectedBy: 'Staff A',
      reference: ''
    },
    {
      id: '2',
      date: '17-Aug-25',
      amount: 1000,
      mode: 'upi',
      collectedBy: 'Staff A',
      reference: 'UPI12345'
    }
  ]);

  // New transaction form
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    mode: 'cash' as const,
    collectedBy: '',
    reference: ''
  });

  // New order item form
  const [newOrderItem, setNewOrderItem] = useState({
    type: 'consultation' as const,
    item: '',
    amount: ''
  });

  const totalDue = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = totalDue - totalPaid;

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getModeDisplay = (mode: string) => {
    const modeMap = {
      cash: 'Cash',
      upi: 'UPI',
      card: 'Card',
      bank_transfer: 'Bank Transfer',
      insurance: 'Insurance'
    };
    return modeMap[mode as keyof typeof modeMap] || mode;
  };

  const addOrderItem = () => {
    if (newOrderItem.item && newOrderItem.amount) {
      const item: PaymentOrderItem = {
        id: Date.now().toString(),
        type: newOrderItem.type,
        item: newOrderItem.item,
        amount: parseFloat(newOrderItem.amount),
        status: 'pending'
      };
      setOrderItems([...orderItems, item]);
      setNewOrderItem({ type: 'consultation', item: '', amount: '' });
    }
  };

  const addTransaction = () => {
    if (newTransaction.amount && newTransaction.collectedBy) {
      const transaction: PaymentTransaction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: '2-digit' 
        }),
        amount: parseFloat(newTransaction.amount),
        mode: newTransaction.mode,
        collectedBy: newTransaction.collectedBy,
        reference: newTransaction.reference
      };
      setTransactions([...transactions, transaction]);
      setNewTransaction({ amount: '', mode: 'cash', collectedBy: '', reference: '' });
    }
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const removeTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Management - Visit 
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Order (Line Items) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Payment Order (Line Items)</span>
                <Button
                  size="sm"
                  onClick={() => {
                    const section = document.getElementById('add-order-item');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="capitalize">{item.type}</TableCell>
                      <TableCell>₹{item.amount}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">Total Due: ₹{totalDue}</div>
              </div>

              {/* Add Order Item Form */}
              <div id="add-order-item" className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Add New Item</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select 
                      value={newOrderItem.type} 
                      onValueChange={(value: any) => setNewOrderItem({...newOrderItem, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Item</Label>
                    <Input
                      value={newOrderItem.item}
                      onChange={(e) => setNewOrderItem({...newOrderItem, item: e.target.value})}
                      placeholder="e.g., Blood Test"
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={newOrderItem.amount}
                      onChange={(e) => setNewOrderItem({...newOrderItem, amount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={addOrderItem} className="w-full">
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Payments (Transactions)</span>
                <Button
                  size="sm"
                  onClick={() => {
                    const section = document.getElementById('add-transaction');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Payment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Collected By</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>{getModeDisplay(transaction.mode)}</TableCell>
                      <TableCell>{transaction.collectedBy}</TableCell>
                      <TableCell>{transaction.reference || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Paid: ₹{totalPaid}</span>
                </div>
                <div className={`flex justify-between text-lg font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>Balance: ₹{balance}</span>
                </div>
              </div>

              {/* Add Transaction Form */}
              <div id="add-transaction" className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Add New Payment</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Payment Mode</Label>
                    <Select 
                      value={newTransaction.mode} 
                      onValueChange={(value: any) => setNewTransaction({...newTransaction, mode: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Collected By</Label>
                    <Input
                      value={newTransaction.collectedBy}
                      onChange={(e) => setNewTransaction({...newTransaction, collectedBy: e.target.value})}
                      placeholder="Staff name"
                    />
                  </div>
                  <div>
                    <Label>Reference Number (Optional)</Label>
                    <Input
                      value={newTransaction.reference}
                      onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                      placeholder="Transaction ID, cheque no, etc."
                    />
                  </div>
                  <Button onClick={addTransaction} className="w-full">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Add Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
