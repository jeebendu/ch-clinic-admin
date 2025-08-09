import { Branch } from "@/admin/modules/branch/types/Branch";
import { EnquiryServiceType } from "@/admin/modules/doctor/submodules/percentage/types/DoctorPercentage";

export interface ClinicServicemap {
    id: number;
    enquiryService: EnquiryServiceType;
    branch: Branch;
}