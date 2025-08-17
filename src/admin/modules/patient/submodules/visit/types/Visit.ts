
import { Patient } from "@/admin/modules/patient/types/Patient";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";

export interface Visit {
  id?: number;
  uid?: string;
  visitDate?: Date | string;
  visitType?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  chiefComplaint?: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: Date | string;
  patient?: Patient;
  doctor?: Doctor;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
