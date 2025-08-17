
export type CheckInStatus = "waiting" | "checked_in" | "in_progress" | "completed" | "no_show";

export interface PaymentFlow {
  id: string;
  appointmentId: string;
  checkInStatus: CheckInStatus;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}
