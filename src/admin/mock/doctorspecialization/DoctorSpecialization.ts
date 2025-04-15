import { Doctor } from "@/admin/types/doctor";
import { Specialization } from "@/admin/types/specialization";

export interface DoctorSpecialization {
    id:number;
    doctor:Doctor;
    specialization:Specialization;
}