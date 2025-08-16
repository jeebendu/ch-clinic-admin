
export type CheckInStatus = 'not_checked_in' | 'checked_in' | 'in_consultation' | 'completed';

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
