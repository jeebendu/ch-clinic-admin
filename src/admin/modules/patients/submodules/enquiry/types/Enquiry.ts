
import { Doctor } from "@/admin/modules/doctor/submodules/doctor/types/Doctor";
import { Patient } from "@/admin/modules/patients/types/Patient";

export interface Enquiry {
  id: number;
  patient: Patient;
  doctor: Doctor;
  date: Date;
  subject: string;
  message: string;
  response?: string;
  isResolved: boolean;
}
