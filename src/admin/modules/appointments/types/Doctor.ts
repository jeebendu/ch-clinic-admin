
import { Clinic } from "../../clinics/types/Clinic";
import { DoctorBranch } from "./DoctorClinic";
import MedicalCouncil from "./MedicalCouncil";
import MedicalDegree from "./MedicalDegree";
import { Patient } from "./Patient";

export interface State {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  fullname: string;
  phone?: string;
  image?: string;
}

export interface Branch {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  district?: District;
  state?: State;
  country?: Country;
  clinic?:Clinic;
}

export interface Specialization {
  id: number;
  name: string;
  description?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price?: number;
}

export interface Language {
  id: number;
  name: string;
}

export interface AdditionalInfoDoctor {
  id: number;
  registationNumber?: string;
  registationYear?: string;
  medicalCouncil: string | MedicalCouncil;
  specialityDegree?: string;
  degreeCollege?: string;
  yearCompletionDegree?: string;
  establishmentType?: 'own' | 'visit';
  establishmentName?: string;
  establishmentCity?: string;
  state?: State;
  district?: District;
}

export interface Doctor {
  id: number;
  uid: string;
  external?: boolean;
  user?: User;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  qualification?: string;
  desgination?: string;
  expYear?: number;
  feesAmount?: number;
  followupAmount?: number;
  about?: string;
  biography?: string;
  gender: number;
  publishedOnline?: boolean;
  includeInDirectory?: boolean;
  verified?: boolean;
  city?: string;
  district?: District;
  state?: State;
  country?: Country;
  degree?: string | MedicalDegree;
  medicalCouncil?: string | MedicalCouncil;
  rating?: number;
  reviewCount?: number;
  joiningDate?: string;
  status?: number;
  imageUrl?: string;
  additionalInfoDoctor?: AdditionalInfoDoctor;
  serviceList?: Service[];
  specializationList?: Specialization[];
  branchList?: DoctorBranch[];
  medicalDegree?: MedicalDegree;
  // Adding missing properties based on errors
  languageList?: Language[];
  consultationFee?: number | string;
  percentages?: any[];
  pincode?: string;
  slug?:String
}



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
  // laboratoryTests: String;
  laoratoryTestList: LabTest[];
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
