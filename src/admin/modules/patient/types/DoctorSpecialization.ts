
import { Specialization } from "../../doctor/submodules/specialization/types/Specialization";
import { Doctor } from "../../doctor/types/Doctor";

export interface DoctorSpecialization {
  id: number;
  doctor: Doctor;
  specialization: Specialization;
}
