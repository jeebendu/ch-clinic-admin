import { Doctor } from "./Doctor";
import { DoctorBranch } from "./DoctorClinic";
import { FamilyMember } from "./FamilyMember";
import { Patient } from "./Patient";
import { Slot } from "./Slot";

export interface Appointment {
  id: number;
  bookingId: string;
  appointmentDate: string | Date;
  status: string;
  patient:Patient;
  doctor: Doctor;
  doctorBranch:DoctorBranch;
  slot?: Slot;
  familyMember?: FamilyMember;
}

export interface AppointmentQueryParams {
  pageno?: number;
  pagesize?: number;
  doctorId?: number;
  searchTerm?: string | null;
  statuses?: string[];
  branches?: number[];
  doctors?: number[];
  date?: string | null;
  status?: string;
  fromDate?: string | null;
  toDate?: string | null;
}

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY', 
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
] as const;

export interface TimeSlot {
  id: number;
  date: string | Date;
  startTime: string;
  endTime: string;
  duration?: number;
}
