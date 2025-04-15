
import { Doctor } from "@/admin/modules/doctors/types/Doctor";
import { Patient, FamilyMember } from "@/admin/modules/patients/types/Patient";
import { Branch } from "@/admin/modules/shared/types/Branch";
import { Clinic } from "@/admin/modules/clinics/types/Clinic";

export type AppointmentType = "direct-visit" | "video-call" | "audio-call";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "new";
export type VisitType = "new" | "follow-up" | "emergency" | "routine";

export interface Appointment {
  id: number;
  appointmentDate: Date;
  status: AppointmentStatus;
  branch: Branch;
  patient: Patient;
  doctor: Doctor;
  slot: Slot;
  familyMember: FamilyMember;
  doctorClinic: DoctorClinic;
  appointmentType?: AppointmentType;
  vitalSigns?: {
    temperature?: string;
    pulse?: string;
    respiratoryRate?: string;
    spo2?: string;
    height?: string;
    weight?: string;
    bmi?: string;
  };
}

export interface Slot {
  id: number;
  doctor?: Doctor;
  branch?: Branch;
  startTime?: string;
  endTime?: string; 
  availableSlots: number;
  date?: Date;
  duration?: number;
  slotType?: string;
  status?: string;
}

export interface DoctorClinic {
  id: number;
  doctor: Doctor;
  clinic: Clinic;
}

export interface PaginatedAppointmentResponse {
  content: Appointment[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface AllAppointment {
  id: number;
  appointmentDate: Date;
  status: string;
  branch: Branch;
  patient: Patient;
  doctor: Doctor;
  slot: Slot;
  familyMember: FamilyMember;
  doctorClinic: DoctorClinic;
  isAccept: boolean;
}

export interface LabTest {
  name: string;
  instructions: string;
}

export interface Medicines {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timings: string;
  instruction: string;
}

export interface StatusUpdate {
  status: string;
}

export interface SearchAppointment {
  status: string;
  date: Date;
}
