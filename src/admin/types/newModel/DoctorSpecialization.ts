
import { Doctor } from "../doctor";
import { Specialization } from "./Specialization";

export interface DoctorSpecialization {
    id:number;
    doctor:Doctor;
    specialization:Specialization;
}
