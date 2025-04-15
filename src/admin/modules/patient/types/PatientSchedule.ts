
import { Patient } from "./Patient";
import { Doctor } from "../../doctor/types/Doctor";

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

export interface ScheduleCount {
  doctor: Doctor;
  referralCounts: RefCount;
}

export interface RefCount {
  referralPatientCount: number;
  createdTime: Date;
}

export interface filterSchedule {
  year: number;
  month: number;
}
