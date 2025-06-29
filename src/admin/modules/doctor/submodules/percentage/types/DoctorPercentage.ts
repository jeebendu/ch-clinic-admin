
import { Doctor } from "../../../types/Doctor";

export interface EnquiryServiceType {
  id: number;
  name: string;
}

export interface DoctorPercentage {
  id: number;
  percentage: number;
  doctor: Doctor;
  enquiryServiceType: EnquiryServiceType;
}
