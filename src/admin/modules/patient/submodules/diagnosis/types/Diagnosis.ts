

import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { Patient } from "../../../types/Patient";

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
