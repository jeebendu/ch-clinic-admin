
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Visit } from "../types/Visit";

interface PaymentItem {
  id: string;
  item: string;
  type: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  mode: string;
  collectedBy: string;
  reference: string;
}

interface PaymentDialogProps {
  visit: Visit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  visit,
  open,
  onOpenChange,
}) => {
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([
    {
      id: '1',
      item: 'Consultation',
      type: 'Consultation',
      amount: 500,
      status: 'Paid'
    },
    {
      id: '2',
      item: 'Blood Test',
      type: 'Lab',
      amount: 300,
      status: 'Pending'
    },
    {
      id: '3',
      item: 'X-Ray',
      type: 'Lab',
      amount: 700,
      status: 'Pending'
    }
  ]);

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([
    {
      id: '1',
      date: '16-Aug-25',
      amount: 500,
      mode: 'Cash',
      collectedBy: 'Staff A',
      reference: '-'
    },
    {
      id: '2',
      date: '17-Aug-25',  
      amount: 1000,
      mode: 'UPI',
      collectedBy: 'Staff A',
      reference: 'UPI12345'
    }
  ]);

  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const totalDue = paymentItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = paymentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = totalDue - totalPaid;

  const removePaymentItem = (id: string) => {
    setPaymentItems(prev => prev.filter(item => item.id !== id));
  };

  const removePaymentTransaction = (id: string) => {
    setPaymentTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details - {visit?.patient.firstname} {visit?.patient.lastname}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Payment Order (Line Items) Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payment Order (Line Items)</h3>
                <Button
                  size="sm"
                  onClick={() => setAddItemOpen(true)}
                  className="bg-brand-primary hover:bg-brand-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-16">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>₹{item.amount}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'Paid' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePaymentItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={2} className="font-semibold">Total Due:</TableCell>
                      <TableCell className="font-semibold">₹{totalDue}</TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Payments (Transactions) Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payments (Transactions)</h3>
                <Button
                  size="sm"
                  onClick={() => setAddPaymentOpen(true)}
                  className="bg-brand-primary hover:bg-brand-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Collected By</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="w-16">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>₹{transaction.amount}</TableCell>
                        <TableCell>{transaction.mode}</TableCell>
                        <TableCell>{transaction.collectedBy}</TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePaymentTransaction(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-semibold">Total Paid:</TableCell>
                      <TableCell className="font-semibold">₹{totalPaid}</TableCell>
                      <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-semibold">Balance:</TableCell>
                      <TableCell className={`font-semibold ${balance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{balance}
                      </TableCell>
                      <TableCell colSpan={4}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <AddItemDialog
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        onAdd={(item) => {
          setPaymentItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
          setAddItemOpen(false);
        }}
      />

      {/* Add Payment Modal */}
      <AddPaymentDialog
        open={addPaymentOpen}
        onOpenChange={setAddPaymentOpen}
        onAdd={(payment) => {
          setPaymentTransactions(prev => [...prev, { ...payment, id: Date.now().toString() }]);
          setAddPaymentOpen(false);
        }}
      />
    </>
  );
};

// Add Item Dialog Component
interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Omit<PaymentItem, 'id'>) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [formData, setFormData] = useState({
    item: '',
    type: '',
    amount: '',
    status: 'Pending' as 'Paid' | 'Pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.item && formData.type && formData.amount) {
      onAdd({
        item: formData.item,
        type: formData.type,
        amount: parseFloat(formData.amount),
        status: formData.status
      });
      setFormData({ item: '', type: '', amount: '', status: 'Pending' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="item">Item</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
              placeholder="e.g., Consultation, Blood Test"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Procedure">Procedure</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Paid' | 'Pending') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Add Payment Dialog Component
interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (payment: Omit<PaymentTransaction, 'id'>) => void;
}

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({ open, onOpenChange, onAdd }) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-GB'),
    amount: '',
    mode: '',
    collectedBy: '',
    reference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.mode && formData.collectedBy) {
      onAdd({
        date: formData.date,
        amount: parseFloat(formData.amount),
        mode: formData.mode,
        collectedBy: formData.collectedBy,
        reference: formData.reference || '-'
      });
      setFormData({
        date: new Date().toLocaleDateString('en-GB'),
        amount: '',
        mode: '',
        collectedBy: '',
        reference: ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="mode">Payment Mode</Label>
            <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="collectedBy">Collected By</Label>
            <Input
              id="collectedBy"
              value={formData.collectedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, collectedBy: e.target.value }))}
              placeholder="Staff name"
              required
            />
          </div>
          <div>
            <Label htmlFor="reference">Reference (Optional)</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Transaction ID, etc."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary">
              Add Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
