
import { Doctor } from "../../doctor/types/Doctor";
import { Clinic } from "../../clinics/types/Clinic";

export interface DoctorClinic {
  id: number;
  doctor: Doctor;
  clinic: Clinic;
}
