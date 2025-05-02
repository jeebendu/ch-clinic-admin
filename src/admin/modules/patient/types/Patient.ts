
import { Address } from "../../core/types/Address";
import { Tenant } from "../../core/types/Tenant";
import { Enquiry } from "./Enquiry";

export interface Patient {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  gender: string;
  address?: Address;
  tenant?: Tenant;
  createdTime?: Date;
  modifiedTime?: Date;
  enquiry?: Enquiry;
  patientId?: string;
  medicalHistory?: string;
  allergies?: string;
  chronicConditions?: string;
  pastSurgeries?: string;
  familyHistory?: string;
}
