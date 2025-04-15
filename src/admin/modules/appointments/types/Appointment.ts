
import { Slot } from "./Slot";
import { Doctor } from "../../doctor/types/Doctor";
import { DoctorClinic } from "./DoctorClinic";
import { FamilyMember, Patient } from "../../patients/types/Patient";
import { Branch } from "../../shared/types/Branch";

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

export interface AppointmentRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  dob: Date;
  gender: number;
  district: District;
  state: State;
  country: Country;
  city: string;
  appointmentDate: string;
  isAccept: boolean;
  isReject: boolean;
  doctor: Doctor;
  appointmentType: { id: number; name: string };
  visitType: { id: number; name: string };
}

export interface SearchRequest {
  date: Date;
}
