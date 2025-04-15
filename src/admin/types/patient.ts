
import { Branch } from "./branch";
import { Country } from "./country";
import { District } from "./district";
import { Doctor, User } from "./doctor";
import { State } from "./state";


export interface Patient {
  id: number;
  uid: string;
  gender: any;
  dob: Date;
  city: string;
  age: number;
  address: string;
  whatsappNo?: string;
  problem?: string;
  refDoctor: Doctor;
  consDoctorId?: number;
  remark?: string;
  pastRemark?: string;
  firstname: string;
  lastname: string;
  createdTime?: Date;
  user: User;
  photoUrl?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  fullName?: string; // Added this property
  lastVisit?: string;
  medicalHistory?: string;

  branch: Branch;
  alternativeContact?: string;
  country?: Country;
  state?: State;
  district?: District;
}

export type UserRole = "admin" | "doctor" | "staff";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  phone: string;
}
