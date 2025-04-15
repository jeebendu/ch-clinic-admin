import { Specialization, DoctorService, Language, Education } from "@/models/doctor/Doctor";
import { District, State, Country } from "@/models/shared/Address";
import { Branch } from "@/models/shared/Branch";
import { User } from "@/models/user/User";
import { Clinic } from "@/services/appointmentService";

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
  percentages: any[]; // Adjust type if percentages have a specific structure
  specializationList: Specialization[];
  serviceList: DoctorService[];
  branchList: Branch[];
  languageList: Language[];
  user: User;
  district: District;
  state: State;
  country: Country;
  education?: Education[]; // Added as optional

  //temp
  consultationFee: any;
  reviewCount: number;
  rating: number;
  clinics: Clinic[]; // Array of Clinic objects
}
