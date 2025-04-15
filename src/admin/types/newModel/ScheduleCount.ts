
import { Doctor } from "../Doctor";

export interface ScheduleCount {
    doctor: Doctor;
    referralCounts:RefCount;
}

export interface RefCount {
    referralPatientCount: number;
    createdTime: Date;
}

export interface filterSchedule {
    year:number;
    month:number;  
}
