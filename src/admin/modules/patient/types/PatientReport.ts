
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "./Patient";

export interface PatientReport {
  id: number;
  reportType: string;
  leftEar?: string;
  rightEar?: string;
  recommendation?: string;
  impression?: string;
  lpf?: string;
  hpf?: string;
  reportno: number;
  patient: Patient;
  createdTime: string;
  modifiedTime: string;
  visitId?: string;
}
