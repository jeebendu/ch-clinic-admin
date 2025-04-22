
import { Branch } from "../../branch/types/Branch";
import { District } from "../../core/types/District";
import { State } from "../../core/types/State";

export interface Doctor {
  id: number;
  name: string;
  mobile: string;
  email: string;
  qualification: string;
  branch: Branch;
  isVerified: boolean;
  additionalInfo?: AdditionalInfoDoctor;
  
  // Additional properties needed by components
  firstname: string;
  lastname: string;
  phone: string;
  expYear: number;
  desgination: string;
  about: string;
  gender: number;
  external: boolean;
  verified: boolean; // alias for isVerified
  biography: string;
  city: string;
  uid: string;
  joiningDate: string;
  user?: {
    id: number;
    branch: any;
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    effectiveTo: string | null;
    effectiveFrom: string | null;
    role: {
      id: number;
      name: string;
      permissions: any[];
    };
    image: string;
  };
  specializationList?: { id: number; name: string }[];
  serviceList?: { id: number; name: string }[];
  branchList?: Branch[];
  languageList?: { id: number; name: string }[];
  district?: District;
  state?: State;
  country?: { id: number; name: string };
  percentages?: any[];
  pincode?: string;
  consultationFee?: number;
  reviewCount?: number;
  rating?: number;
  publishedOnline?: boolean;
  status?: string;
}

export interface AdditionalInfoDoctor {
  id: number;
  registationNumber: string;
  registationCouncil: string;
  registationYear: string;
  degreeCollege: string;
  yearCompletionDegree: string;
  establishmentType?: "own" | "visit";
  establishmentName: string;
  establishmentCity: string;
  state: State;
  district: District;
}
