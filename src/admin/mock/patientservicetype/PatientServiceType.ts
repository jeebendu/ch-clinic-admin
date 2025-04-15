import { EnquiryServiceType } from "@/admin/types/doctor";
import { Patient } from "@/admin/types/patient";

export interface PatientServiceType {
    id:number;
    enquiryservicetype:EnquiryServiceType;
    patient:Patient;
}