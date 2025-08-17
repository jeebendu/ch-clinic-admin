
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Receipt, 
  Plus, 
  Download, 
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Invoice } from '@/admin/modules/appointments/types/Invoice';
import { format } from 'date-fns';

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onAddPayment: (invoiceId: number) => void;
  onDownloadInvoice: (invoiceId: number) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  open,
  onClose,
  invoices,
  onCreateInvoice,
  onAddPayment,
  onDownloadInvoice
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'default';
      case 'partial': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const isOverdue = (invoice: Invoice) => {
    return invoice.dueDate && invoice.dueDate < new Date() && invoice.status !== 'paid';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoice Management
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Invoice List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Invoices ({invoices.length})</h3>
              <Button onClick={onCreateInvoice} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {invoices.map((invoice) => (
                <Card 
                  key={invoice.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedInvoice?.id === invoice.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">Invoice #{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(invoice.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOverdue(invoice) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span>₹{invoice.totalAmount.toLocaleString()}</span>
                      <span className="text-muted-foreground">
                        Paid: ₹{invoice.paidAmount.toLocaleString()}
                      </span>
                    </div>

                    {invoice.dueDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {format(invoice.dueDate, 'MMM dd, yyyy')}
                      </p>
                    )}

                    <div className="flex gap-1 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadInvoice(invoice.id);
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {invoice.status !== 'paid' && (
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddPayment(invoice.id);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {invoices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices found</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={onCreateInvoice}
                  >
                    Create First Invoice
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            {selectedInvoice ? (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Invoice Details
                      <Badge variant={getStatusColor(selectedInvoice.status)}>
                        {selectedInvoice.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Invoice #</p>
                      <p className="font-medium">{selectedInvoice.id}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      {selectedInvoice.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.description}</span>
                          <span>₹{item.totalPrice.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Paid:</span>
                        <span>₹{selectedInvoice.paidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Pending:</span>
                        <span>₹{(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedInvoice.payments.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {selectedInvoice.payments.map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {payment.paymentType} • {format(payment.paymentDate, 'MMM dd')}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {payment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an invoice to view details</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
