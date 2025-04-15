
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "./Patient";

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

export interface  LabTest{
  name: any;
  instructions: any;

}
