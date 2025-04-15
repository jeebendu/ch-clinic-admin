
import { Patient } from "@/admin/modules/patients/types/Patient";
import { Doctor } from "@/admin/modules/doctor/submodules/doctor/types/Doctor";

export interface PatientSchedule {
  id: number;
  patient: Patient;
  doctor: Doctor;
  scheduleDate: Date;
  type: ScheduleType;
  notes?: string;
  status: ScheduleStatus;
  isReminded: boolean;
}

export type ScheduleType = 'follow-up' | 'medicine-reminder' | 'test-results' | 'general';
export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled' | 'missed';
