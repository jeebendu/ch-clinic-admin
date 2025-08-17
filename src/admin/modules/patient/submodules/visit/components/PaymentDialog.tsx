
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Plus, 
  FileText, 
  Download, 
  Eye 
} from "lucide-react";
import { Visit } from "../types/Visit";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  visit
}) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');

  if (!visit) return null;

  // Mock payment data
  const payments = [
    {
      id: 1,
      amount: 500,
      method: 'cash',
      status: 'completed',
      transactionId: 'TXN001',
      date: new Date(),
      notes: 'Consultation fee'
    },
    {
      id: 2,
      amount: 200,
      method: 'upi',
      status: 'pending',
      transactionId: 'TXN002',
      date: new Date(),
      notes: 'Medicine payment'
    }
  ];

  // Mock invoice data
  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-001',
      total: 1000,
      paid: 500,
      balance: 500,
      status: 'partial',
      date: new Date(),
      items: [
        { description: 'Consultation', amount: 500 },
        { description: 'Medicine', amount: 300 },
        { description: 'Lab Test', amount: 200 }
      ]
    }
  ];

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'upi':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Payment & Invoice Management - {visit.patient.firstname} {visit.patient.lastname}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh] overflow-hidden">
          {/* Left Side - Payment Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Orders</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(70vh-120px)]">
              {payments.map((payment) => (
                <Card key={payment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(payment.method)}
                        <span className="font-medium">₹{payment.amount}</span>
                      </div>
                      <Badge className={`${getStatusColor(payment.status)} text-xs`}>
                        {payment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="capitalize">{payment.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <span>{payment.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{payment.date.toLocaleDateString()}</span>
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

              {payments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No payments found
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Invoices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(70vh-120px)]">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{invoice.invoiceNumber}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {invoice.date.toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(invoice.status)} text-xs`}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-medium">₹{invoice.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Paid:</span>
                        <span className="text-green-600">₹{invoice.paid}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Balance:</span>
                        <span className="text-red-600">₹{invoice.balance}</span>
                      </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Items:</p>
                      {invoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>{item.description}</span>
                          <span>₹{item.amount}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {invoices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No invoices found
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
