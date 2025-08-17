
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Receipt, CreditCard, Plus, FileText } from 'lucide-react';
import { Visit } from '../../types/Visit';
import PaymentDialog from './PaymentDialog';

interface VisitPaymentProps {
  visit: Visit;
  onPaymentUpdate?: (visitId: string | number) => void;
}

interface PaymentSummary {
  totalDue: number;
  totalPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'pending';
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
  referenceNumber?: string;
}

const VisitPayment: React.FC<VisitPaymentProps> = ({ 
  visit, 
  onPaymentUpdate 
}) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Mock data - in real implementation, this would come from API
  const [paymentSummary] = useState<PaymentSummary>({
    totalDue: visit.paymentAmount || 500,
    totalPaid: visit.paymentPaid || 0,
    balance: (visit.paymentAmount || 500) - (visit.paymentPaid || 0),
    status: visit.paymentStatus as 'paid' | 'partial' | 'pending' || 'pending'
  });

  const [orderItems] = useState<PaymentOrderItem[]>([
    {
      id: '1',
      type: 'consultation',
      description: 'Doctor Consultation',
      amount: 500,
      status: 'pending'
    }
  ]);

  const [transactions] = useState<PaymentTransaction[]>([]);

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

  const handleOpenPaymentDialog = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    // Optionally refresh payment data here
    if (onPaymentUpdate) {
      onPaymentUpdate(visit.id!);
    }
  };

  return (
   
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Payment & Billing
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(paymentSummary.status)}
              <Button 
                onClick={handleOpenPaymentDialog}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Manage Payment
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Due</div>
              <div className="text-2xl font-bold">₹{paymentSummary.totalDue}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Paid</div>
              <div className="text-2xl font-bold text-green-600">₹{paymentSummary.totalPaid}</div>
            </div>
            <div className={`p-4 rounded-lg ${paymentSummary.balance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="text-sm text-muted-foreground">Balance</div>
              <div className={`text-2xl font-bold ${paymentSummary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{paymentSummary.balance}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Billing Items
            </h4>
            <div className="space-y-2">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-muted-foreground capitalize">{item.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{item.amount}</div>
                    <Badge 
                      variant={item.status === 'paid' ? 'default' : 'secondary'}
                      className={item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Recent Payments
              </h4>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">₹{transaction.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.mode} • {transaction.date}
                        {transaction.referenceNumber && ` • ${transaction.referenceNumber}`}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenPaymentDialog}
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Collect Payment
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={paymentSummary.totalPaid === 0}
            >
              <FileText className="h-4 w-4 mr-1" />
              Generate Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      
  );
};

export default VisitPayment;
