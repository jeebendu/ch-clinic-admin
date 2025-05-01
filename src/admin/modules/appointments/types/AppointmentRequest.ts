
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "../../patient/types/Patient";
import { DoctorClinic } from "../../doctor/types/DoctorClinic";
import { Service } from "../../service/types/Service";

export interface AppointmentRequest {
  id: number;
  doctorClinic: DoctorClinic;
  service?: Service;
  patient?: Patient;
  doctor?: Doctor;
  date?: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  requestType?: string;
  priority?: 'normal' | 'urgent' | 'emergency';
}
