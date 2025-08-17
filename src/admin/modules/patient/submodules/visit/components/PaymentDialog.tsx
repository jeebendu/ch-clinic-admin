
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Visit } from "../types/Visit";
import { DollarSign, Receipt, Plus, FileText } from "lucide-react";

interface PaymentDialogProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (visit: Visit) => void;
  onCreateInvoice: (visit: Visit) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  visit,
  isOpen,
  onClose,
  onAddPayment,
  onCreateInvoice,
}) => {
  if (!visit) return null;

  // Mock data for demonstration - replace with actual data from your API
  const mockPaymentOrders = [
    {
      id: 1,
      amount: 150.00,
      status: "pending",
      createdDate: "2024-01-15",
      description: "Consultation Fee"
    },
    {
      id: 2,
      amount: 75.00,
      status: "paid",
      createdDate: "2024-01-14",
      description: "Lab Tests"
    }
  ];

  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      amount: 225.00,
      status: "sent",
      dueDate: "2024-02-15",
      createdDate: "2024-01-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Management - {visit.patient?.firstname} {visit.patient?.lastname}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Orders - Left Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Orders</h3>
              <Button
                size="sm"
                onClick={() => onAddPayment(visit)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Payment
              </Button>
            </div>

            <div className="space-y-3">
              {mockPaymentOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {order.description}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${order.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {order.createdDate}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            Mark as Paid
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockPaymentOrders.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No payment orders found for this visit
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => onAddPayment(visit)}
                    >
                      Create Payment Order
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Invoices - Right Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoices</h3>
              <Button
                size="sm"
                onClick={() => onCreateInvoice(visit)}
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>

            <div className="space-y-3">
              {mockInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {invoice.invoiceNumber}
                      </CardTitle>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {invoice.dueDate}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {invoice.createdDate}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button size="sm" variant="ghost">
                          Send to Patient
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockInvoices.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No invoices found for this visit
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => onCreateInvoice(visit)}
                    >
                      Create Invoice
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="border-t pt-4 mt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{mockPaymentOrders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ${mockPaymentOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                ${mockPaymentOrders
                  .filter(order => order.status === 'paid')
                  .reduce((sum, order) => sum + order.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
