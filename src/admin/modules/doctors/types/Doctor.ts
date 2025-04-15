
import { Specialization } from "./Specialization";
import { Branch } from "@/admin/modules/shared/types/Branch";
import { User } from "@/admin/modules/users/types/User";

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
