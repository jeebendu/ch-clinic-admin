
export type CheckInStatus = 'not_checked_in' | 'checked_in' | 'in_consultation' | 'completed';

export interface PaymentFlow {
  id: number;
  appointmentId: number;
  status: CheckInStatus;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  createdTime: Date;
  modifiedTime: Date;
}
