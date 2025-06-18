
export interface PaymentInfo {
  id: string;
  amount: number;
  paymentType: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  transactionId?: string;
  paymentDate: Date;
  status: 'completed' | 'pending' | 'failed';
}

export type CheckInStatus = 'not_checked_in' | 'checked_in' | 'in_consultation' | 'completed';

export interface AppointmentWorkflow {
  appointmentId: number;
  checkInStatus: CheckInStatus;
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  paymentInfo?: PaymentInfo;
  notes?: string;
}
