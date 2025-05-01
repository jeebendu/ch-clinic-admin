
import { Branch } from "@/admin/modules/branch/types/Branch";
import { User } from "@/admin/modules/user/types/User";
import { Country, District, State } from "@/admin/modules/core/types/Address";
import { Specialization } from "../submodules/specialization/types/Specialization";
import { MedicalDegree } from "./MedicalDegree";
import { MedicalCouncil } from "./MedicalCouncil";

export interface AdditionalInfoDoctor {
    id: number;
    registationNumber: string;
    medicalCouncil: MedicalCouncil;
    registationYear: string;
    degreeCollege: string;
    yearCompletionDegree: string;
    establishmentType?: "own" | "visit"; 
    establishmentName: string;
    establishmentCity: string;
    state: State;
    district: District;
}

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  external: boolean;
  desgination?: string;
  expYear?: number;
  email: string;
  phone: string;
  medicalDegree?: MedicalDegree;
  qualification?: string;
  joiningDate?: string;
  about?: string;
  image?: string;
  pincode?: string;
  city?: string;
  biography?: string;
  gender?: number | string;
  verified?: boolean;
  publishedOnline?: boolean;
  registrationNumber?: string;
  additionalInfo?: AdditionalInfoDoctor;
  percentages?: any[];
  specializationList?: Specialization[];
  serviceList?: DoctorService[];
  branchList?: Branch[];
  languageList?: Language[];
  user?: User;
  district?: District;
  state?: State;
  country?: Country;
  education?: Education[];
  consultationFee?: string;
  reviewCount?: number;
  rating?: number;
  status?: string;
  additionalInfoDoctor?: AdditionalInfoDoctor;
  active?: boolean;
  dob?: string;
  degree?: MedicalDegree;
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
