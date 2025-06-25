
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

  
  // New fields
  tagline?: string;
  description?: string;
  website?: string;
  alternatePhone?: string;
  emergencyContact?: string;
  landmark?: string;
  logo?: string;
  banner?: string;
  favicon?: string;
  establishedYear?: number;
  services?: string[];
  specialties?: string[];
  businessHours?: any[]; // Replace 'any' with a proper type if available
  afterHoursAvailable?: boolean;
  licenseNumber?: string;
  licenseAuthority?: string;
  licenseExpiryDate?: Date;
  accreditations?: string[];
  paymentMethods?: string[];
  insuranceAccepted?: string[];
  metaTitle?: string;
  metaDescription?: string;
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



export interface BusinessHours {
  day: string;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  breakStart?: string;
  breakEnd?: string;
}

export interface Accreditation {
  id?: number;
  name: string;
  issuingAuthority: string;
  certificateNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  document?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

export const INSURANCE_PROVIDERS = [
  'Star Health', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz',
  'New India Assurance', 'Oriental Insurance', 'United India Insurance',
  'National Insurance', 'Reliance General', 'Cholamandalam MS',
  'Royal Sundaram', 'Future Generali', 'Universal Sompo', 'Other'
];

export const PAYMENT_METHODS = [
  'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking',
  'Paytm', 'PhonePe', 'Google Pay', 'Cheque', 'EMI'
];
