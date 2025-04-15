import { Country } from "@/admin/types/country";
import { District } from "@/admin/types/district";
import { Doctor } from "@/admin/types/doctor";
import { State } from "@/admin/types/state";

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
    appointmentType: AppointmentType;
    visitType: VisitType;
}

export interface SearchRequest {
    date: Date;
}

export interface StatusUpdate {
    status: boolean;
}

export interface VisitType {
    id: number;
    name: string;
}

export interface AppointmentType {
    id: number;
    name: string;
}