
import { Specialization } from "./specialization";
import { Branch } from "./branch";
import { Role } from "./User";

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

export interface User{
  id: number;
  branch: Branch;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  effectiveTo?: Date;
  effectiveFrom?: Date;
  role: Role;
  image: string;
}

export interface SearchForm {
    value: String;
    doctorType?: any;
    specialization: any;
}

export interface SearchReport {
    refDrId:number;
    fromDate: Date;
    toDate: Date;
}

export interface EnquiryServiceType {
    id: number;
    name: string;
    price:number
}
