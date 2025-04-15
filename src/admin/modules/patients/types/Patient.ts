
import { Doctor } from "../../doctors/types/Doctor";
import { User } from "../../users/types/User";
import { Branch } from "../../branch/types/Branch";

export interface Patient {
  id: number;
  uid: string;
  gender: string;
  dob: Date;
  age: number;
  address: string;
  firstname: string;
  lastname: string;
  refDoctor: Doctor | null;
  user: User;
  photoUrl?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  fullName?: string;
  lastVisit?: string;
  medicalHistory?: string;
  city?: string;
  whatsappNo?: string;
  problem?: string;
  createdTime?: Date;
  branch?: Branch;
}
