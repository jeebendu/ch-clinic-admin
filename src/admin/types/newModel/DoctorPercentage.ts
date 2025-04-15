
import { Doctor, EnquiryServiceType } from "../Doctor";

export interface DoctorPercentage {
    id:number;
    percentage: number;
    doctor:Doctor;
    enquiryServiceType:EnquiryServiceType;
}
