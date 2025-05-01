
import { Doctor } from "./Doctor";
import { Branch } from "../../branch/types/Branch";

export interface DoctorClinic {
  id: number;
  doctor: Doctor;
  branch: Branch;
  isActive: boolean;
  isDefault?: boolean;
}
