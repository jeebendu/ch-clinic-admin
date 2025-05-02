
import { Country, District, State } from "../../core/types/Address";
import { Doctor } from "../../doctor/types/Doctor";

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
}
