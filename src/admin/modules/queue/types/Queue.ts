
import { Patient } from "../../patient/types/Patient";
import { Doctor } from "../../doctor/types/Doctor";
import { Branch } from "../../branch/types/Branch";
import { Appointment } from "../../appointments/types/Appointment";

export type QueueStatus = 'waiting' | 'called' | 'in_consultation' | 'completed' | 'no_show';

export type QueueSource = 'online_appointment' | 'walk_in' | 'staff_added';

export interface QueueItem {
  id: string;
  tokenNumber: string;
  patient: Patient;
  doctor: Doctor;
  branch: Branch;
  appointment?: Appointment;
  status: QueueStatus;
  source: QueueSource;
  priority: number;
  estimatedWaitTime?: number;
  checkedInTime?: Date;
  calledTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  notes?: string;
  createdTime: Date;
  modifiedTime: Date;
}

export interface QueueFilter {
  doctorId?: number;
  branchId?: number;
  status?: QueueStatus[];
  source?: QueueSource[];
  date?: Date;
  searchTerm?: string;
}

export interface QueueStats {
  totalWaiting: number;
  totalInConsultation: number;
  totalCompleted: number;
  averageWaitTime: number;
  longestWaitTime: number;
}
