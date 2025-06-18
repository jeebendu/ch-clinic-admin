
import { Branch } from "../../branch/types/Branch";
import { Doctor } from "../../doctor/types/Doctor";
import { DoctorBranch } from "./DoctorClinic";

export interface Slot {
    id: number;
   doctorBranch?:DoctorBranch;
    startTime?: string;
    endTime?: string; 
    availableSlots: number;
    date?: Date;
    duration?: number;
    slotType?: string;
    status?: string;
    description?: string;
    notes?: string;
}
