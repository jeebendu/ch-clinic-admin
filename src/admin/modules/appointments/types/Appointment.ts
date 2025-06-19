import { FamilyMember } from "./FamilyMember";

export interface Appointment {
  id: number;
  bookingId: string;
  appointmentDate: string | Date;
  appointmentTime: string;
  status: string;
  paymentStatus: string;
  consultationFee: number;
  appointmentType: {
    id: number;
    name: string;
  };
  patient: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    phone: string;
    gender: string;
    dob: string | Date;
    user: {
      id: number;
      email: string;
      phone: string;
      image: string;
    };
  };
  doctor: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    qualification: string;
    expYear: number;
    specializationList: {
      id: number;
      name: string;
    }[];
  };
  branch: {
    id: number;
    name: string;
    location: string;
  };
  doctorBranch: {
    id: number;
    consultationFee: number;
    doctor: any;
    branch: any;
  };
  slot?: TimeSlot;
  familyMember?: FamilyMember;
}

export interface AppointmentQueryParams {
  pageno?: number;
  pagesize?: number;
  doctorId?: number;
  searchTerm?: string | null;
  statuses?: string[];
  branches?: number[];
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
