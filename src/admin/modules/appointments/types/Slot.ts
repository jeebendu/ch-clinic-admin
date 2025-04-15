
import { Doctor } from "../../doctor/types/Doctor";
import { Branch } from "../../shared/types/Branch";

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
}
