
import { Branch } from "../../branch/types/Branch";
import { Doctor } from "./Doctor";
import { Service } from "../../service/types/Service";

export interface DoctorClinic {
  id: number;
  clinic: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: any;
    pincode: string;
    latitude: number;
    longitude: number;
    active: boolean;
    branchList: any[];
    image: string;
    district: any;
    country: any;
  };
  doctor: Doctor;
  available: boolean;
  fees: number;
  serviceList: Service[];
  branch: Branch;
}
