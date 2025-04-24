
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "../../patient/types/Patient";
import { DoctorClinic } from "./DoctorClinic";
import { FamilyMember } from "./FamilyMember";
import { Slot } from "./Slot";
import { District } from "../../core/types/District";
import { State } from "../../core/types/State";
import { Country } from "../../core/types/Country";
import { Source } from "../../user/types/Source";
import { Relation } from "../../user/types/Relation";

export type AppointmentType = "direct-visit" | "video-call" | "audio-call";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "new";
export type VisitType = "new" | "follow-up" | "emergency" | "routine";

export interface Appointment {
  id: number;
  isAccept: boolean;
  status: string;
  appointmentDate: Date;
  appointmentType?: string;
  patient: Patient;
  doctor: Doctor;
  slot: Slot;
  familyMember: FamilyMember | null;
  doctorClinic: DoctorClinic;
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


export interface AppointmentQueryParams {
  page: number;
  size: number;
  doctorId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: String;
  branches?: Number[];
  statuses?: String[];
}

export type TimeSlot = {
  id: string;
  day: string;
  startTime: string;
  capacity: number;
};


export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export interface AppointmentRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Changed from number to string
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
  appointmentType: {
    id: number;
    name: string;
  };
  visitType: {
    id: number;
    name: string;
  };
  source?: Source;
  relation?: Relation;
}
