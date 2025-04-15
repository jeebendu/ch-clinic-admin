
import { Branch } from "../../shared/types/Branch";
import { Country } from "../../shared/types/Country";
import { District } from "../../shared/types/District";
import { State } from "../../shared/types/State";
import { Doctor } from "../../doctor/types/Doctor";
import { User } from "../../users/types/User";

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
  fullName?: string;
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

export interface SearchPatient {
  inputValue: String;
}
