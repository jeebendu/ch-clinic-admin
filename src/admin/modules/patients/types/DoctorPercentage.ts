
import { Doctor } from "../../doctor/types/Doctor";
import { EnquiryServiceType } from "../../doctor/types/Doctor";

export interface DoctorPercentage {
  id: number;
  percentage: number;
  doctor: Doctor;
  enquiryServiceType: EnquiryServiceType;
}
