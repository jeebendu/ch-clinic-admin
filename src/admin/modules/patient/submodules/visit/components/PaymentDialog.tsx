
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  Calendar,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { Visit } from '../types/Visit';

interface PaymentOrder {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  createdDate: Date;
  paidDate?: Date;
  transactionId?: string;
  notes?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PaymentDialogProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
  onAddPayment?: (visit: Visit) => void;
  onCreateInvoice?: (visit: Visit) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  visit,
  isOpen,
  onClose,
  onAddPayment,
  onCreateInvoice
}) => {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visit && isOpen) {
      loadPaymentData();
    }
  }, [visit, isOpen]);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockPaymentOrders: PaymentOrder[] = [
        {
          id: '1',
          amount: 500,
          status: 'paid',
          paymentMethod: 'upi',
          createdDate: new Date(),
          paidDate: new Date(),
          transactionId: 'TXN123456',
          notes: 'Consultation fee'
        },
        {
          id: '2',
          amount: 200,
          status: 'pending',
          paymentMethod: 'cash',
          createdDate: new Date(),
          notes: 'Medicine charges'
        }
      ];

      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-001',
          amount: 700,
          paidAmount: 500,
          status: 'sent',
          createdDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: [
            {
              id: '1',
              description: 'Consultation Fee',
              quantity: 1,
              rate: 500,
              amount: 500
            },
            {
              id: '2',
              description: 'Medicine',
              quantity: 1,
              rate: 200,
              amount: 200
            }
          ]
        }
      ];

      setPaymentOrders(mockPaymentOrders);
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  if (!visit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Payment Details - {visit.patient.firstname} {visit.patient.lastname}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 h-[70vh]">
          {/* Payment Orders - Left Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Orders</h3>
              <Button 
                size="sm" 
                onClick={() => onAddPayment?.(visit)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Payment
              </Button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100%-60px)]">
              {loading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : paymentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No payment orders found</p>
                </div>
              ) : (
                paymentOrders.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="font-semibold">₹{payment.amount}</span>
                        </div>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Created: {format(payment.createdDate, 'MMM dd, yyyy HH:mm')}</span>
                        </div>

                        {payment.paidDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Paid: {format(payment.paidDate, 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        )}

                        {payment.transactionId && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                          </div>
                        )}

                        {payment.notes && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Notes:</span> {payment.notes}
                          </div>
                        )}

                        <div className="capitalize text-muted-foreground">
                          <span className="font-medium">Method:</span> {payment.paymentMethod.replace('_', ' ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Invoices - Right Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCreateInvoice?.(visit)}
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100%-60px)]">
              {loading ? (
                <div className="space-y-3">
                  {Array(2).fill(0).map((_, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices found</p>
                </div>
              ) : (
                invoices.map((invoice) => (
                  <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{invoice.invoiceNumber}</CardTitle>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Amount:</span>
                          <span className="font-semibold">₹{invoice.amount}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Paid Amount:</span>
                          <span className="font-semibold text-green-600">₹{invoice.paidAmount}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Balance:</span>
                          <span className="font-semibold text-red-600">₹{invoice.amount - invoice.paidAmount}</span>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Created: {format(invoice.createdDate, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {format(invoice.dueDate, 'MMM dd, yyyy')}</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Items:</h4>
                          {invoice.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.description}</span>
                              <span>₹{item.amount}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
