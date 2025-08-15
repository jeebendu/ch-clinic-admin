
import { Tenant } from "../../core/types/Tenant";
import { State } from "../../core/types/State";
import { District } from "../../core/types/District";
import { Branch } from "../../branch/types/Branch";
import { User } from "../../user/types/User";
import { Doctor } from "./Doctor";
import { Enquiry } from "./Enquiry";

export interface Patient {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  fullName?: string;
  email: string;
  mobile: string; // Changed from 'phone' to 'mobile' to match API
  phone?: string; // Added for backwards compatibility
  whatsappNo?: string;
  alternativeContact?: string; // Added this property
  gender: string;
  dob: Date;
  age: number;
  address: string;
  city?: string;
  state: State;
  district: District;
  branch?: Branch;
  refDoctor: Doctor | null;
  user: User;
  photoUrl?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  lastVisit?: string;
  medicalHistory?: string;
  allergies?: string;
  chronicConditions?: string;
  pastSurgeries?: string;
  familyHistory?: string;
  problem?: string;
  enquiry?: Enquiry;
  tenant?: Tenant;
  createdTime?: Date;
  modifiedTime?: Date;
}
