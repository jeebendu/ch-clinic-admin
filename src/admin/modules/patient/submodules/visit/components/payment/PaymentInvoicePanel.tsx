
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, Receipt, Download } from 'lucide-react';
import { PaymentRecord, PaymentSummary } from '../../types/PaymentTypes';

interface PaymentInvoicePanelProps {
  paymentSummary: PaymentSummary;
  paymentRecords: PaymentRecord[];
  onCollectPayment?: () => void;
  onGenerateInvoice?: () => void;
  onDownloadReceipt?: (paymentId: string) => void;
  readOnly?: boolean;
}

const PaymentInvoicePanel: React.FC<PaymentInvoicePanelProps> = ({
  paymentSummary,
  paymentRecords,
  onCollectPayment,
  onGenerateInvoice,
  onDownloadReceipt,
  readOnly = false
}) => {
  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'upi': return '📱';
      case 'bank_transfer': return '🏦';
      case 'insurance': return '🛡️';
      default: return '💰';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'pending': return 'text-orange-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment & Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Payment Summary</h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Bill Amount:</span>
              <span className="font-semibold">₹{paymentSummary.totalBillAmount.toFixed(2)}</span>
            </div>
            
            {paymentSummary.discountAmount && paymentSummary.discountAmount > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-green-600">-₹{paymentSummary.discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-semibold text-green-600">₹{paymentSummary.totalPaidAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b-2 border-gray-300 bg-gray-50 px-3 rounded">
              <span className="font-semibold text-gray-800">Outstanding Amount:</span>
              <span className={`font-bold text-lg ${getStatusColor(paymentSummary.status)}`}>
                ₹{paymentSummary.outstandingAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Records */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">Payment History</h4>
            {!readOnly && paymentSummary.outstandingAmount > 0 && (
              <Button 
                onClick={onCollectPayment}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Collect Payment
              </Button>
            )}
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {paymentRecords.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No payments received yet
              </div>
            ) : (
              paymentRecords.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPaymentModeIcon(payment.paymentMode)}</span>
                      <div>
                        <div className="font-semibold">₹{payment.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {payment.paymentMode.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={payment.status === 'completed' ? 'default' : 'secondary'}
                        className={payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                 payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                 'bg-red-100 text-red-800'}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Date: {payment.paymentDate.toLocaleDateString()} {payment.paymentDate.toLocaleTimeString()}</div>
                    {payment.transactionId && (
                      <div>Transaction ID: {payment.transactionId}</div>
                    )}
                    {payment.notes && (
                      <div>Notes: {payment.notes}</div>
                    )}
                  </div>

                  {payment.status === 'completed' && !readOnly && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadReceipt?.(payment.id)}
                        className="text-blue-600 hover:text-blue-700 h-6 px-2 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Receipt
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!readOnly && (
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onGenerateInvoice}
              disabled={paymentSummary.totalBillAmount === 0}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentInvoicePanel;
