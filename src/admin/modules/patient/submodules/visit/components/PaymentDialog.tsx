
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Eye, 
  Download, 
  FileText,
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import { format } from "date-fns";
import { Visit } from "../types/Visit";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: Visit | null;
}

// Mock data types
interface PaymentOrder {
  id: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
  paidOn: string;
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
  balance: number;
  status: 'paid' | 'partial' | 'unpaid';
  createdOn: string;
  dueDate?: string;
  items: InvoiceItem[];
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onOpenChange, visit }) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');

  // Mock data - replace with actual API calls
  const mockPayments: PaymentOrder[] = [
    {
      id: '1',
      amount: 500,
      method: 'card',
      status: 'completed',
      transactionId: 'TXN123456',
      paidOn: '2024-01-15T10:30:00Z',
      notes: 'Consultation fee'
    },
    {
      id: '2',
      amount: 200,
      method: 'cash',
      status: 'completed',
      paidOn: '2024-01-15T11:00:00Z',
      notes: 'Lab tests payment'
    }
  ];

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      totalAmount: 1000,
      paidAmount: 700,
      balance: 300,
      status: 'partial',
      createdOn: '2024-01-15T09:00:00Z',
      dueDate: '2024-01-22T23:59:59Z',
      items: [
        { id: '1', description: 'Consultation', quantity: 1, unitPrice: 500, total: 500 },
        { id: '2', description: 'Blood Test', quantity: 1, unitPrice: 300, total: 300 },
        { id: '3', description: 'X-Ray', quantity: 1, unitPrice: 200, total: 200 }
      ]
    }
  ];

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'upi': return <Wallet className="h-4 w-4" />;
      case 'bank_transfer': return <Wallet className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPayment = () => {
    console.log('Add payment clicked');
  };

  const handleCreateInvoice = () => {
    console.log('Create invoice clicked');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice:', invoice.id);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.id);
  };

  if (!visit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment & Invoice Management
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{visit.patient?.firstname} {visit.patient?.lastname}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Visit #{visit.id}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Side - Payment Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Orders</h3>
              <Button onClick={handleAddPayment} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {mockPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="font-medium">₹{payment.amount}</span>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{format(new Date(payment.paidOn), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                      {payment.transactionId && (
                        <div className="flex justify-between">
                          <span>Transaction ID:</span>
                          <span className="font-mono text-xs">{payment.transactionId}</span>
                        </div>
                      )}
                      {payment.notes && (
                        <div className="pt-2 border-t">
                          <span className="text-xs">{payment.notes}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No payments recorded</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Paid:</span>
                <span className="text-green-600">
                  ₹{mockPayments.reduce((sum, payment) => 
                    payment.status === 'completed' ? sum + payment.amount : sum, 0
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Invoices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <Button onClick={handleCreateInvoice} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {mockInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{invoice.invoiceNumber}</CardTitle>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(new Date(invoice.createdOn), 'MMM dd, yyyy')}</span>
                      {invoice.dueDate && (
                        <span>Due: {format(new Date(invoice.dueDate), 'MMM dd')}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Total Amount:</span>
                        <span className="font-medium">₹{invoice.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Paid Amount:</span>
                        <span className="text-green-600">₹{invoice.paidAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Balance:</span>
                        <span className={invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                          ₹{invoice.balance}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-1 mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Items:</p>
                      {invoice.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span>{item.description} ({item.quantity}x)</span>
                          <span>₹{item.total}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
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
                  </CardContent>
                </Card>
              ))}

              {mockInvoices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No invoices created</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Invoiced:</span>
                  <span>₹{mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Outstanding Balance:</span>
                  <span className="text-red-600">
                    ₹{mockInvoices.reduce((sum, inv) => sum + inv.balance, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
