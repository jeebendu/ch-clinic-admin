
import { Branch } from "../shared/Branch";
import { Doctor } from "../doctor/Doctor";

export interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  branch?: Branch;
  doctor?: Doctor;
  date: Date;
  availableSlots: number;
  duration: number;
  slotType: string;
}
