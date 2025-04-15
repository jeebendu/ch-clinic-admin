
import { Branch } from "@/admin/types/branch";
import { User } from "@/admin/types/User";

export interface Specialization {
  id: number;
  name: string;
}

export interface DoctorService {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  external: boolean;
  desgination: string;
  expYear?: number;
  email: string;
  phone: string;
  qualification: string;
  joiningDate: string;
  about: string;
  image: string;
  pincode: string;
  city: string;
  biography: string;
  gender: number;
  verified: boolean;
  percentages: any[];
  specializationList: Specialization[];
  serviceList: DoctorService[];
  branchList: Branch[];
  languageList: Language[];
  user: User;
  district: any;
  state: any;
  country: any;
  education?: Education[];

  //temp
  consultationFee: any;
  reviewCount: number;
  rating: number;
  clinics: Clinic[];
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  contact: string;
}
