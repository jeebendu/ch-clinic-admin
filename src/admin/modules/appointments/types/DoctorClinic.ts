
import { Doctor } from "../../doctor/types/Doctor";
import { Branch } from "../../branch/types/Branch";

export interface DoctorBranch {
  id: number;
  doctor?: Doctor;
  branch: Branch;
  consultationFee?: number; // Added this property
}
