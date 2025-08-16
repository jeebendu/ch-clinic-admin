import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { Patient } from "../../../types/Patient";


export interface Visit {
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
