import { Doctor, EnquiryServiceType } from "@/admin/types/doctor";


export interface DoctorPercentage {
    id: number;
    percentage: number;
    doctor: Doctor;
    enquiryServiceType: EnquiryServiceType;
}