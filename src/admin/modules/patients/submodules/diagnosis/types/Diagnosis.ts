
import { Doctor } from "@/admin/modules/doctor/submodules/doctor/types/Doctor";
import { Patient } from "@/admin/modules/patients/types/Patient";

export interface Diagnosis {
  id: number;
  patient: Patient;
  doctor: Doctor;
  date: Date;
  symptoms: string;
  diagnosis: string;
  notes: string;
  followUpDate?: Date;
  isFollowUpRequired: boolean;
}
