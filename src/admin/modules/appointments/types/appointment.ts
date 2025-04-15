
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "../../patient/types/Patient";
import { DoctorClinic } from "./DoctorClinic";
import { Slot } from "./Slot";



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
  familyMember: any | null;
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
  branches: Number[];
  statuses: String[];
}

export type TimeSlot = {
  id: string;
  day: string;
  startTime: string;
  capacity: number;
};


export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
