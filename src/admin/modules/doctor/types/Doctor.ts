
import { Branch } from "../../shared/types/Branch";
import { Country, District, State } from "../../shared/types/Address";
import { User } from "../../users/types/User";

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  name?: string;
  email: string;
  phone?: string;
  mobile?: number;
  external: boolean;
  desgination: string;
  expYear?: number;
  qualification: string;
  joiningDate: Date | string;
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
  branchList?: Branch[];
  languageList?: Language[];
  user: User;
  district?: District;
  state?: State;
  country?: Country;
  education?: Education[];
  consultationFee?: any;
  reviewCount?: number;
  rating?: number;
  status?: string;
  external_temp?: any;
  specialization?: string;
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

export interface SearchForm {
  value: String;
  doctorType?: any;
  specialization: any;
}

export interface SearchReport {
  refDrId: number;
  fromDate: Date;
  toDate: Date;
}

export interface EnquiryServiceType {
  id: number;
  name: string;
  price: number;
}
