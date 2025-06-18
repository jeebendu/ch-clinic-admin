
import { Country, District, State } from "../../core/types/Address";
import { Branch } from "../../branch/types/Branch";
import { Module } from "../../core/types/Module";
import { Tenant } from "../../core/types/Tenant";

export interface featureList {
  id: number;
  module: Module;
  print: boolean;
}

export interface Plan {
  id?: number;
  name?: string;
  features?: featureList;
}

export interface ClinicStatus {
  adminUserId?: number;
  adminEmail?: string;
  adminPhone?: string;
  databaseStatus?: string;
  schemaVersion?: string;
  userCreationStatus?: string;
}

export interface Clinic {
  id: number;
  uid?: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: Plan;
  tenant?: Tenant;
  branches?: Branch[];
  state?: State;
  district?: District;
  country?: Country;
  city?: string;
  pincode?: number;
  active?: boolean;
  createdTime?: Date;
  modifiedTime?: Date;
}

export interface ClinicRequest {
  id: number;
  title: string;
  name: string;
  email: string;
  contact: string;
  contactName?: string;
  address: string;
  city: string;
  status: string;
  requestDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  notes?: string;
}

export interface ClinicQueryParams {
  pageno?: number;
  pagesize?: number;
  searchTerm?: string | null;
  status?: string;
  state?: number;
  district?: number;
}
