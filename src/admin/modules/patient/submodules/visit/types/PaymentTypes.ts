
export interface ClinicalOrderItem {
  id: string;
  serviceType: 'consultation' | 'procedure' | 'medication' | 'lab_test' | 'imaging';
  serviceName: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  addedDate: Date;
  completedDate?: Date;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentMode: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  transactionId?: string;
  paymentDate: Date;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface PaymentSummary {
  totalBillAmount: number;
  totalPaidAmount: number;
  outstandingAmount: number;
  discountAmount?: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

export interface VisitPaymentData {
  visitId: string | number;
  patientName: string;
  visitDate: Date;
  clinicalOrders: ClinicalOrderItem[];
  paymentRecords: PaymentRecord[];
  paymentSummary: PaymentSummary;
}
