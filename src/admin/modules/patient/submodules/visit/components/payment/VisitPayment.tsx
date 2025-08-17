
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  Calendar,
  User,
  FileText,
  Plus
} from 'lucide-react';
import { Visit } from '../../types/Visit';
import PaymentProcessDialog from '@/admin/components/dialogs/PaymentProcessDialog';
import { PaymentInfo } from '@/admin/modules/appointments/types/PaymentFlow';

interface VisitPaymentProps {
  visit: Visit | null;
}

const VisitPayment: React.FC<VisitPaymentProps> = ({ visit }) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  if (!visit) {
    return (
      <div className="p-6 text-center text-gray-500">
        No visit data available
      </div>
    );
  }

  const handleProcessPayment = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
  };

  const handlePaymentComplete = (paymentInfo: PaymentInfo) => {
    console.log('Payment completed:', paymentInfo);
    // Handle payment completion logic here
    setIsPaymentDialogOpen(false);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock payment data - replace with actual data from your API
  const paymentData = {
    totalAmount: 1500,
    paidAmount: 0,
    pendingAmount: 1500,
    status: 'pending',
    dueDate: new Date(),
    transactions: []
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Payment Details
            </div>
            {getPaymentStatusBadge(paymentData.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visit Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Patient:</span>
              <span className="font-medium">{visit.patient?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Visit Date:</span>
              <span className="font-medium">{formatDate(visit.visitDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Visit ID:</span>
              <span className="font-medium">#{visit.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Doctor:</span>
              <span className="font-medium">{visit.doctor?.name || 'N/A'}</span>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(paymentData.totalAmount)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Amount</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(paymentData.paidAmount)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Paid Amount</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(paymentData.pendingAmount)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending Amount</div>
            </div>
          </div>

          {/* Payment Actions */}
          {paymentData.pendingAmount > 0 && (
            <div className="flex justify-center">
              <Button 
                onClick={handleProcessPayment}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Process Payment
              </Button>
            </div>
          )}

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </h3>
            {paymentData.transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No payment transactions found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {paymentData.transactions.map((transaction: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                      <div className="text-sm text-gray-600">{transaction.method}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatDate(transaction.date)}</div>
                      <Badge className={
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PaymentProcessDialog
        appointment={visit}
        isOpen={isPaymentDialogOpen}
        onClose={handleClosePaymentDialog}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default VisitPayment;
