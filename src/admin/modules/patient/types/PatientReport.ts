
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
  reportType?: string; // Added field to track report type
}
