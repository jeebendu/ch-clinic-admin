
import { Branch } from "../../branch/types/Branch";
import { District } from "../../core/types/District";
import { State } from "../../core/types/State";
import { Doctor } from "../../doctor/types/Doctor";
import { User } from "../../user/types/User";

export interface Patient {
  state: State;
  district: District;
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
