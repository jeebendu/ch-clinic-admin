
import { Doctor } from "./Doctor";
import { Patient } from "./Patient";
import { Clinic} from "./clinic";
import { State } from "./state";
import { District } from "./district";
import { Country } from "./country";

export interface AllAppointment {
  id: number;
  status: string;
  patient: Patient;
  doctor: Doctor;
  slot: Slot;
  familyMember: FamilyMember;
  doctorClinic: DoctorClinic;
}

export interface DoctorClinic{
    id: number;
    doctor: Doctor;
    clinic: Clinic;
}


export interface FamilyMember {
    id: number;
    name: String;
    age: number;
    gender: String;
    phone: String;
    relationship: String;
}

export interface Slot{
    id: number;
    doctor?: Doctor;
    branch?: Branch;
    startTime?:string;
    endTime?: string; 
    availableSlots: number;
    date?: Date;
    duration?: number;
    slotType?: String;
    status?: string;
}

export interface Branch{
    id: number;
    name: string;
    code: string;
    location: string;
    active: boolean;
    state: State;
    district: District;
    country: Country;
    city: string;
    mapUrl: string;
    pincode: number;
    image: string;
    latitude: number;
    longitude: number;
}


export interface StatusUpdate {
status:String;
}

export interface SearchAppointment {
    status:String;
    date:Date;
}
