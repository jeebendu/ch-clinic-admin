
import { Patient } from "./Patient";

export interface PatientReport {
  id: number;
  leftEar: string;
  rightEar: string;
  recommendation: string;
  impression: string;
  lpf: string;
  hpf: string;
  reportno: number;
  patient: Patient;
  createdTime: string;
  modifiedTime: string;
  reportType?: string; // Type can be 'audiometry', 'dental', 'laboratory', 'radiography', 'speech', 'general'
}

export interface VitalSign {
  id?: number;
  patientId: number;
  visitId?: number;
  temperature?: number;
  bloodPressure?: string;
  pulse?: number;
  respiratoryRate?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  waist?: number;
  notes?: string;
  recordedBy?: string;
  recordedAt: string;
}

export interface LabTest {
  id?: number;
  patientId: number;
  visitId?: number;
  testName: string;
  testType: string;
  status: 'ordered' | 'in-progress' | 'completed' | 'cancelled';
  orderedBy: string;
  orderedAt: string;
  results?: string;
  resultType?: 'numeric' | 'text' | 'file';
  normalRange?: string;
  notes?: string;
  completedAt?: string;
}

export interface PatientPayment {
  id?: number;
  patientId: number;
  visitId?: number;
  invoiceNumber?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'insurance' | 'other';
  status: 'pending' | 'paid' | 'partial' | 'cancelled';
  notes?: string;
  services?: string[];
}

export interface ReferralInfo {
  id?: number;
  patientId: number;
  referralDoctorId?: number;
  referralDoctorName?: string;
  referralDate: string;
  commissionRate?: number;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}
