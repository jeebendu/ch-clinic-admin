
import { Branch } from "../../branch/types/Branch";
import { Doctor } from "../../doctor/types/Doctor";

export interface Slot {
    id: number;
    doctor?: Doctor;
    branch?: Branch;
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
