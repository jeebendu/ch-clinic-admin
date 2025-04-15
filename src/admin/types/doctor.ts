
import { User } from "./User";
import { Specialization } from "./specialization";

export interface Doctor {
  id: number;
  name: string;
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
  lastname?: string;
  firstname?: string;
}

export interface EnquiryServiceType {
  id: number;
  name: string;
}
