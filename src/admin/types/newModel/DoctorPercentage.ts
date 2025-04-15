import { Doctor, EnquiryServiceType } from "../doctor";


export interface DoctorPercentage {

    id:number;
    percentage: number;
    doctor:Doctor;
    enquiryServiceType:EnquiryServiceType;
}

