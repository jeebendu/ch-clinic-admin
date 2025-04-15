
import { Doctor } from "./Doctor";
import { Branch } from "../../shared/types/Branch";

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

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime?: string;
  capacity?: number;
}

export interface DayAvailability {
  day: string;
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface AvailabilitySettings {
  generalAvailability: DayAvailability[];
  clinicAvailability: {
    [clinicId: string]: DayAvailability[];
  };
  appointmentFees: string;
  leaves: DoctorLeave[];
}
