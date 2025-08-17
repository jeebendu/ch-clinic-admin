
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Receipt, 
  Download, 
  Eye, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Building2,
  Shield
} from "lucide-react";
import { Visit } from "../types/Visit";
import { format } from "date-fns";

interface PaymentOrder {
  id: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paidOn: Date;
  notes?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdDate: Date;
  dueDate?: Date;
  items: InvoiceItem[];
}

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose, visit }) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');

  // Mock data - replace with actual API calls
  const mockPayments: PaymentOrder[] = [
    {
      id: '1',
      amount: 500,
      paymentMethod: 'card',
      status: 'completed',
      transactionId: 'TXN123456',
      paidOn: new Date('2024-01-15'),
      notes: 'Consultation fee'
    },
    {
      id: '2',
      amount: 200,
      paymentMethod: 'upi',
      status: 'completed',
      transactionId: 'UPI789012',
      paidOn: new Date('2024-01-15'),
      notes: 'Lab tests'
    }
  ];

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      totalAmount: 1000,
      paidAmount: 700,
      balanceAmount: 300,
      status: 'sent',
      createdDate: new Date('2024-01-15'),
      dueDate: new Date('2024-01-30'),
      items: [
        { id: '1', description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 },
        { id: '2', description: 'Lab Tests', quantity: 2, unitPrice: 100, total: 200 },
        { id: '3', description: 'Medicines', quantity: 1, unitPrice: 300, total: 300 }
      ]
    }
  ];

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer': return <Building2 className="h-4 w-4" />;
      case 'insurance': return <Shield className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPayment = () => {
    console.log('Add payment clicked');
    // Implement add payment logic
  };

  const handleCreateInvoice = () => {
    console.log('Create invoice clicked');
    // Implement create invoice logic
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice:', invoice);
    // Implement view invoice logic
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice);
    // Implement download invoice logic
  };

  if (!visit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Payment Details - {visit.patient?.firstname} {visit.patient?.lastname}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 h-[600px]">
          {/* Left Side - Payment Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Orders</h3>
              <Button onClick={handleAddPayment} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>
            
            <ScrollArea className="h-[520px]">
              <div className="space-y-3">
                {mockPayments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="font-medium">₹{payment.amount}</span>
                        </div>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Method:</span>
                          <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                        </div>
                        {payment.transactionId && (
                          <div className="flex justify-between">
                            <span>Transaction ID:</span>
                            <span className="font-mono">{payment.transactionId}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Paid On:</span>
                          <span>{format(payment.paidOn, 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                        {payment.notes && (
                          <div className="flex justify-between">
                            <span>Notes:</span>
                            <span>{payment.notes}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {mockPayments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No payments found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Invoices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <Button onClick={handleCreateInvoice} size="sm">
                <Receipt className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
            
            <ScrollArea className="h-[520px]">
              <div className="space-y-3">
                {mockInvoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{invoice.invoiceNumber}</CardTitle>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        {/* Invoice Summary */}
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-semibold">₹{invoice.totalAmount}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground">Paid</div>
                            <div className="font-semibold text-green-600">₹{invoice.paidAmount}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-muted-foreground">Balance</div>
                            <div className="font-semibold text-red-600">₹{invoice.balanceAmount}</div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Invoice Items */}
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Items:</div>
                          {invoice.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                              <span>{item.description} x{item.quantity}</span>
                              <span>₹{item.total}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator />
                        
                        {/* Invoice Details */}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span>{format(invoice.createdDate, 'MMM dd, yyyy')}</span>
                          </div>
                          {invoice.dueDate && (
                            <div className="flex justify-between">
                              <span>Due:</span>
                              <span>{format(invoice.dueDate, 'MMM dd, yyyy')}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewInvoice(invoice)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="flex-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {mockInvoices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
