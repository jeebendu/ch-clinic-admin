
import { Doctor } from "../../../types/Doctor";

export interface DoctorReport {
  id: number;
  doctor: Doctor;
  period: string;
  appointmentsCount: number;
  patientsCount: number;
  revenue: number;
  generatedDate: Date;
}
