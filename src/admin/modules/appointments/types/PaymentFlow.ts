
export type CheckInStatus = 'not_checked_in' | 'checked_in' | 'in_consultation' | 'completed';

export interface PaymentInfo {
  paymentType: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'insurance';
  amount: number;
  transactionId?: string;
  paymentDate: Date;
  notes?: string;
}

export interface AppointmentWorkflow {
  appointmentId: number;
  checkInStatus: CheckInStatus;
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  paymentInfo?: PaymentInfo;
  notes?: string;
}

// If any code relies on a PaymentFlow shape, keep it exported too (non-breaking).
export interface PaymentFlow {
  id: string;
  appointmentId: string;
  checkInStatus: CheckInStatus;
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
