
import { Invoice, Payment, PaymentSummary } from '../types/Invoice';

export const invoiceService = {
  async getInvoicesByVisitId(visitId: number): Promise<Invoice[]> {
    // Mock implementation - replace with actual API call
    return [
      {
        id: 1,
        visitId,
        totalAmount: 1500,
        paidAmount: 1000,
        status: 'partial',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: [
          {
            id: 1,
            description: 'Consultation Fee',
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
            type: 'consultation'
          },
          {
            id: 2,
            description: 'Blood Test',
            quantity: 1,
            unitPrice: 1000,
            totalPrice: 1000,
            type: 'lab_test'
          }
        ],
        payments: [
          {
            id: 1,
            invoiceId: 1,
            amount: 1000,
            paymentType: 'card',
            transactionId: 'TXN123456',
            paymentDate: new Date(),
            status: 'completed'
          }
        ]
      }
    ];
  },

  async createInvoice(visitId: number, items: any[]): Promise<Invoice> {
    // Mock implementation
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return {
      id: Date.now(),
      visitId,
      totalAmount,
      paidAmount: 0,
      status: 'pending',
      createdAt: new Date(),
      items,
      payments: []
    };
  },

  async addPayment(invoiceId: number, payment: Omit<Payment, 'id' | 'invoiceId'>): Promise<Payment> {
    // Mock implementation
    return {
      id: Date.now(),
      invoiceId,
      ...payment,
      status: 'completed'
    };
  },

  async getPaymentSummary(visitId: number): Promise<PaymentSummary> {
    const invoices = await this.getInvoicesByVisitId(visitId);
    
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pendingAmount = totalAmount - paidAmount;
    const hasOverdueInvoices = invoices.some(inv => 
      inv.dueDate && inv.dueDate < new Date() && inv.status !== 'paid'
    );
    
    const allPayments = invoices.flatMap(inv => inv.payments);
    const lastPaymentDate = allPayments.length > 0 
      ? new Date(Math.max(...allPayments.map(p => p.paymentDate.getTime())))
      : undefined;

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      invoiceCount: invoices.length,
      hasOverdueInvoices,
      lastPaymentDate
    };
  }
};
