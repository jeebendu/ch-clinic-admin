
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";

export interface DoctorAvailability {
  dayOfWeek: String;
  active: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
  branch: Branch;
  doctor: Doctor;
  id: number;
  releaseType:string;
  slotQuantity:number;
  releaseBefore:number;
}



export interface DoctorLeave {
  id: number;
  doctor: Doctor;
  branch: Branch;
  leaveStart: Date;
  leaveEnd: Date;
  reason: string;
  approved:boolean;
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
