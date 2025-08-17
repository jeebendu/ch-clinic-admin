
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Receipt, 
  AlertCircle, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PaymentSummary as PaymentSummaryType } from '@/admin/modules/appointments/types/Invoice';

interface PaymentSummaryProps {
  summary: PaymentSummaryType;
  onViewInvoices: () => void;
  onAddPayment: () => void;
  className?: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  summary,
  onViewInvoices,
  onAddPayment,
  className
}) => {
  const getPaymentStatus = () => {
    if (summary.pendingAmount === 0) {
      return { status: 'paid', icon: CheckCircle2, color: 'text-green-600' };
    }
    if (summary.hasOverdueInvoices) {
      return { status: 'overdue', icon: AlertCircle, color: 'text-red-600' };
    }
    if (summary.paidAmount > 0) {
      return { status: 'partial', icon: CreditCard, color: 'text-yellow-600' };
    }
    return { status: 'pending', icon: DollarSign, color: 'text-blue-600' };
  };

  const { status, icon: StatusIcon, color } = getPaymentStatus();

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${color}`} />
            <span className="font-medium text-sm">Payment Status</span>
          </div>
          <Badge 
            variant={status === 'paid' ? 'default' : status === 'overdue' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-medium">₹{summary.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paid Amount:</span>
            <span className="font-medium text-green-600">₹{summary.paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pending:</span>
            <span className={`font-medium ${summary.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{summary.pendingAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invoices:</span>
            <span className="font-medium">{summary.invoiceCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewInvoices}
            className="flex-1 text-xs"
          >
            <Receipt className="h-3 w-3 mr-1" />
            View Invoices
          </Button>
          {summary.pendingAmount > 0 && (
            <Button
              size="sm"
              onClick={onAddPayment}
              className="flex-1 text-xs"
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Add Payment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
