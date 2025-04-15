
import { Branch } from "./Branch";
import { Country } from "./Address";
import { District } from "./Address";
import { Doctor } from "./Doctor";
import { User } from "./User";
import { State } from "./Address";

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
