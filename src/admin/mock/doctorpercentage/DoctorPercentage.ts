
import { Doctor, EnquiryServiceType } from "@/admin/types/Doctor";

export interface DoctorPercentage {
    id: number;
    percentage: number;
    doctor: Doctor;
    enquiryServiceType: EnquiryServiceType;
}
