import { Doctor } from "../doctor";

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