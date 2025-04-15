
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";

export interface DoctorAvailability {
  id: number;
  doctor: Doctor;
  branch: Branch;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorLeave {
  id: number;
  doctor: Doctor;
  startDate: Date;
  endDate: Date;
  reason: string;
}
