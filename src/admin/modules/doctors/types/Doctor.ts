
import { Specialization } from "./Specialization";
import { Branch } from "@/admin/modules/shared/types/Branch";
import { User } from "@/admin/modules/users/types/User";
import { Clinic } from "@/admin/modules/clinics/types/Clinic";
import { District, State, Country } from "@/admin/modules/shared/types/Address";

export interface Doctor {
    id: number;
    name: string;
    lastname: string;
    firstname: string;
    email: string;
    uid: string;
    mobile: number;
    desgination: string;
    specialization: string;
    specializationList: Specialization[];
    qualification: string;
    joiningDate: Date;
    user: User;
    status: string;
    external: boolean;
    external_temp: any;
    expYear?: number;
    phone?: string;
    about?: string;
    image?: string;
    pincode?: string;
    city?: string;
    biography?: string;
    gender?: number;
    verified?: boolean;
    percentages?: any[];
    serviceList?: any[];
    branchList?: Branch[];
    languageList?: any[];
    district?: District;
    state?: State;
    country?: Country;
    education?: any[];
    consultationFee?: any;
    reviewCount?: number;
    rating?: number;
    clinics?: Clinic[];
}

export interface Language {
    id: number;
    name: string;
}

export interface DoctorService {
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
