
import { EnquiryServiceType } from "@/admin/types/Doctor";
import { Patient } from "@/admin/types/Patient";

export interface PatientServiceType {
    id:number;
    enquiryservicetype:EnquiryServiceType;
    patient:Patient;
}
