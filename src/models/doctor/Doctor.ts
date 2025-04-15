
import { User } from "../user/User";

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  name: string;
  external: boolean;
  desgination: string;
  expYear?: number;
  email: string;
  mobile: number;
  phone?: string;
  qualification: string;
  joiningDate: Date;
  about?: string;
  image?: string;
  pincode?: string;
  city?: string;
  biography?: string;
  gender?: number;
  verified?: boolean;
  percentages?: any[];
  specializationList: Specialization[];
  serviceList?: DoctorService[];
  branchList?: any[];
  languageList?: Language[];
  user: User;
  district?: any;
  state?: any;
  country?: any;
  education?: Education[];
  specialization: string;
  status: string;
  external_temp: any;
}

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
