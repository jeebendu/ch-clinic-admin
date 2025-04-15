
import { Doctor } from "../../doctor/types/Doctor";
import { Specialization } from "../../doctor/types/Doctor";

export interface DoctorSpecialization {
  id: number;
  doctor: Doctor;
  specialization: Specialization;
}
