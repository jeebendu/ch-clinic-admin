
import { Branch } from "@/admin/modules/branch/types/Branch";
import { User } from "@/admin/modules/user/types/User";
import { Country, District, State } from "@/admin/modules/core/types/Address";
import { Specialization } from "../submodules/specialization/types/Specialization";

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  external: boolean;
  desgination: string;
  expYear: number;
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
  publishedOnline: boolean;
  registrationNumber?: string;
  onboardingDetails?: DoctorOnboardingDetails;
  percentages: any[];
  specializationList: Specialization[];
  serviceList: DoctorService[];
  branchList: Branch[];
  languageList: Language[];
  user: User;
  district: District;
  state: State;
  country: Country;
  education?: Education[];
  consultationFee: any;
  reviewCount: number;
  rating: number;
  status: string;
}

export interface DoctorOnboardingDetails {
  registrationNumber: string;
  registrationYear?: string;
  registrationCouncil?: string;
  specialityDegree?: string;
  specialityYear?: string;
  specialityInstitute?: string;
  identityProof?: string;
  addressProof?: string;
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
