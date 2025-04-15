
import { Doctor } from "../../doctor/types/Doctor";
import { EnquiryServiceType } from "@/admin/types/newModel/EnquiryServiceType";

export interface DoctorPercentage {
  id: number;
  percentage: number;
  doctor: Doctor;
  enquiryServiceType: EnquiryServiceType;
}
