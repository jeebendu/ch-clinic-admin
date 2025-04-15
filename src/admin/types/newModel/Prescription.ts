import { Doctor } from "../doctor";
import { Patient } from "../patient";
import { appointmentType, visitType } from "./AppointmentType";
export interface Prescription {

    id: number;
    medicines: Medicines[];
    temperature: number;
    pulse: number;
    respiratory: number;
    spo2: number;
    height: number;
    weight: number;
    waist: number;
    bsa: number;
    bmi: number;
    previousHistory: string;
    previousClinicNote: String;
    clinicNotes: string;
    laboratoryTests: String;
    complaints: string;
    advice: string;


    followUp: Date;
    symptoms: string;
    diagnosis: string;


    // appointmentType:appointmentType;
    // visitType:visitType;
    doctor: Doctor;
    patient: Patient;

}

export interface Medicines {

    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    timings: string;
    instruction: string;
}