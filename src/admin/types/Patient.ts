
import { Doctor } from "./Doctor";
import { User } from "./User";

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
  branch: any;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  fullName?: string;
  lastVisit?: string;
  medicalHistory?: string;
  alternativeContact?: string;
  country?: any;
  state?: any;
  district?: any;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  phone: string;
}
