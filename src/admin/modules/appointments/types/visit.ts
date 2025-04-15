
export type VisitType = "routine" | "follow-up" | "emergency";
export type VisitStatus = "open" | "closed" | "follow-up";

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

export interface Appointment {
  id: string;
  patientId: string;
  scheduledDate: string;
  staffId: string;
  status: "scheduled" | "completed" | "cancelled";
}
