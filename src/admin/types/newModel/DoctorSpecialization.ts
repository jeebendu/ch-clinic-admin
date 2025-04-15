
import { Specialization } from "./Specialization";
import { Doctor } from "../Doctor";

export interface DoctorSpecialization {
    id:number;
    doctor:Doctor;
    specialization:Specialization;
}
