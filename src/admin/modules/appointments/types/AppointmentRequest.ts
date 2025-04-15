
import { Country } from "../../core/types/Country";
import { District } from "../../core/types/District";
import { Doctor } from "../../doctors/types/Doctor";
import { State } from "../../core/types/State";

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
    appointmentType: {
        id: number;
        name: string;
    };
    visitType: {
        id: number;
        name: string;
    };
}
