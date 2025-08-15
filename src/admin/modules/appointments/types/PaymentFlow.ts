
export type CheckInStatus = "pending" | "checkedIn" | "completed" | "cancelled";

export interface PaymentFlow {
  id: number;
  appointmentId: number;
  paymentType: "cash" | "card" | "upi" | "insurance";
  amount: number;
  referenceNumber?: string;
  status: CheckInStatus;
  createdAt: Date;
  updatedAt: Date;
}
