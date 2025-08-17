
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Visit } from '../../types/Visit';
import PaymentDialog from './PaymentDialog';
import ClinicalOrdersTable from './ClinicalOrdersTable';
import PaymentInvoicePanel from './PaymentInvoicePanel';
import { VisitPaymentData, ClinicalOrderItem, PaymentRecord, PaymentSummary } from '../../types/PaymentTypes';

interface VisitPaymentProps {
  visit: Visit;
  onPaymentUpdate?: (visitId: string | number) => void;
}

const VisitPayment: React.FC<VisitPaymentProps> = ({ 
  visit, 
  onPaymentUpdate 
}) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Mock data - in real implementation, this would come from API
  const [paymentData] = useState<VisitPaymentData>({
    visitId: visit.id!,
    patientName: `${visit.patient?.firstname || ''} ${visit.patient?.lastname || ''}`,
    visitDate: new Date(visit.appointmentDate || new Date()),
    clinicalOrders: [
      {
        id: '1',
        serviceType: 'consultation',
        serviceName: 'Doctor Consultation',
        description: 'General consultation with Dr. Smith',
        unitPrice: 500,
        quantity: 1,
        totalAmount: 500,
        status: 'completed',
        addedDate: new Date(),
      },
      {
        id: '2',
        serviceType: 'lab_test',
        serviceName: 'Blood Test',
        description: 'Complete Blood Count (CBC)',
        unitPrice: 300,
        quantity: 1,
        totalAmount: 300,
        status: 'pending',
        addedDate: new Date(),
      }
    ],
    paymentRecords: [
      {
        id: '1',
        amount: 500,
        paymentMode: 'upi',
        transactionId: 'TXN123456789',
        paymentDate: new Date(),
        status: 'completed',
        notes: 'Payment for consultation'
      }
    ],
    paymentSummary: {
      totalBillAmount: 800,
      totalPaidAmount: 500,
      outstandingAmount: 300,
      discountAmount: 0,
      status: 'partial'
    }
  });

  const getOutstandingStatusIcon = (amount: number) => {
    if (amount === 0) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (amount > 0) return <AlertCircle className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-600" />;
  };

  const getOutstandingStatusColor = (amount: number) => {
    if (amount === 0) return 'bg-green-50 border-green-200';
    if (amount > 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800',
      overdue: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleCollectPayment = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
    if (onPaymentUpdate) {
      onPaymentUpdate(visit.id!);
    }
  };

  const handleAddOrder = () => {
    console.log('Add new clinical order');
    // TODO: Implement add order dialog
  };

  const handleEditOrder = (orderId: string) => {
    console.log('Edit order:', orderId);
    // TODO: Implement edit order dialog
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log('Delete order:', orderId);
    // TODO: Implement delete order confirmation
  };

  const handleGenerateInvoice = () => {
    console.log('Generate invoice');
    // TODO: Implement invoice generation
  };

  const handleDownloadReceipt = (paymentId: string) => {
    console.log('Download receipt for payment:', paymentId);
    // TODO: Implement receipt download
  };

  return (
    <div className="space-y-6">
      {/* Outstanding Amount Header */}
      <Card className={`border-2 ${getOutstandingStatusColor(paymentData.paymentSummary.outstandingAmount)}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getOutstandingStatusIcon(paymentData.paymentSummary.outstandingAmount)}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Outstanding Amount</h3>
                <p className="text-sm text-gray-600">
                  Visit Date: {paymentData.visitDate.toLocaleDateString()} • Patient: {paymentData.patientName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ₹{paymentData.paymentSummary.outstandingAmount.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(paymentData.paymentSummary.status)}
                <span className="text-sm text-gray-500">
                  of ₹{paymentData.paymentSummary.totalBillAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Side - Clinical Orders Table */}
        <div className="lg:col-span-1">
          <ClinicalOrdersTable
            orders={paymentData.clinicalOrders}
            onAddOrder={handleAddOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        </div>

        {/* Right Side - Payment Invoice Panel */}
        <div className="lg:col-span-1">
          <PaymentInvoicePanel
            paymentSummary={paymentData.paymentSummary}
            paymentRecords={paymentData.paymentRecords}
            onCollectPayment={handleCollectPayment}
            onGenerateInvoice={handleGenerateInvoice}
            onDownloadReceipt={handleDownloadReceipt}
          />
        </div>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={handleClosePaymentDialog}
        visit={visit}
        outstandingAmount={paymentData.paymentSummary.outstandingAmount}
      />
    </div>
  );
};

export default VisitPayment;
