
export type VisitType = "routine" | "follow-up" | "emergency";
export type VisitStatus = "open" | "closed" | "follow-up";
export type PaymentStatus = "paid" | "partial" | "pending" | "unpaid";

export interface Visit {
  id: string;
  patientId: string;
  visitDate: string;
  visitType: VisitType;
  reasonForVisit: string;
  createdBy: string; // StaffID
  notes?: string;
  doctorId?: string;
  status: VisitStatus;
  paymentStatus?: string; // New field
  paymentAmount?: number; // New field
  paymentPaid?: number; // New field for partial payments
  referralDoctorId?: string | null; // New field
  referralDoctorName?: string; // New field
}

export interface Test {
  id: string;
  visitId: string;
  testType: string;
  reportDate: string;
  testResults?: string;
  createdBy: string; // StaffID
  reportFile?: string; // URL to the file
}

export interface Diagnosis {
  id: string;
  visitId: string;
  diagnosisText: string;
  treatmentPrescribed: string;
  doctorId: string;
  followUpDate?: string;
}
