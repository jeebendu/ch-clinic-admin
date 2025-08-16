
export interface VisitItem {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientUid: string;
  doctorName: string;
  doctorSpecialization: string;
  visitDate: string;
  visitType: string;
  reasonForVisit: string;
  status: string;
  paymentStatus?: string;
  paymentAmount?: number;
  paymentPaid?: number;
  notes?: string;
  referralDoctorName?: string | null;
}
