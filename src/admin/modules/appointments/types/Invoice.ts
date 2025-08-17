
export interface Invoice {
  id: number;
  visitId: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  createdAt: Date;
  dueDate?: Date;
  items: InvoiceItem[];
  payments: Payment[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'consultation' | 'procedure' | 'medication' | 'lab_test' | 'other';
}

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  paymentType: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  transactionId?: string;
  paymentDate: Date;
  notes?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PaymentSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  invoiceCount: number;
  hasOverdueInvoices: boolean;
  lastPaymentDate?: Date;
}
