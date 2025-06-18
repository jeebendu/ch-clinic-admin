
import { Country, District, State } from "../../core/types/Address";

export interface ClinicProfile {
  id?: number;
  
  // Basic Information
  name: string;
  description?: string;
  tagline?: string;
  establishedYear?: number;
  
  // Contact Information
  email: string;
  phone: string;
  alternatePhone?: string;
  fax?: string;
  
  // Address Information
  address: string;
  city: string;
  state?: State;
  district?: District;
  country?: Country;
  pincode: number;
  landmark?: string;
  
  // Digital Assets
  logo?: string;
  banner?: string;
  favicon?: string;
  website?: string;
  
  // Business Hours
  businessHours?: BusinessHours[];
  
  // Licensing & Certifications
  licenseNumber?: string;
  licenseAuthority?: string;
  licenseExpiryDate?: Date;
  accreditations?: Accreditation[];
  
  // Social Media
  socialMedia?: SocialMediaLinks;
  
  // SEO & Branding
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  brandColors?: BrandColors;
  
  // Services & Specialties
  services?: string[];
  specialties?: string[];
  
  // Insurance & Payment
  insuranceAccepted?: string[];
  paymentMethods?: string[];
  
  // Emergency & After Hours
  emergencyContact?: string;
  afterHoursAvailable?: boolean;
  
  // System Fields
  active?: boolean;
  createdTime?: Date;
  modifiedTime?: Date;
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
