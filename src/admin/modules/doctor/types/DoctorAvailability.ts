import { Branch } from "../../branch/types/Branch";
import { Doctor } from "./Doctor";

export type DoctorAvailability = {
  dayOfWeek: String;
  active: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
  branch: Branch;
  doctor: Doctor;
  id: number;
  releaseType:string;
  slotQuantity:number;
};
  
export type DoctorLeave = {
  id: number;
  doctorId: number;
  startDate: string;
  endDate: string;
  reason: string;
};
