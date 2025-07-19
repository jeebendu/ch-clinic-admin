
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";

export interface TimeRange {
  id?: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  slotQuantity: number;
}

export interface DoctorAvailability {
  dayOfWeek: string;
  active: boolean;
  timeRanges: TimeRange[];
  branch: Branch;
  doctor: Doctor;
  id: number;
  releaseType: string;
  releaseBefore: number;
  releaseTime: string; // New field for release time
}

export interface DoctorLeave {
  id: number;
  doctor: Doctor;
  branch: Branch;
  leaveStart: Date;
  leaveEnd: Date;
  reason: string;
  approved: boolean;
}

export interface DoctorBreak {
  id?: number;
  doctor: Doctor;
  branch: Branch;
  dayOfWeek: string;
  breakStart: string;
  breakEnd: string;
  description: string;
}

export interface ClinicHoliday {
  id: number;
  branch: Branch;
  date: Date;
  reason: string;
}
