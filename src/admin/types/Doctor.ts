
import { Branch } from "./Branch";
import { User } from "./User";

// Re-export types properly
export type EnquiryServiceType = {
  id: number;
  name: string;
  description?: string;
  status?: boolean;
};

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    specialization: string;
    bio: string;
    profilePicture: string;
    branchList: Branch[];
    user: User;
    // Timings
    availableTimings: string[];
    // Add any other relevant doctor properties here
}
  
export type DoctorAvailability = {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
};
  
export type DoctorLeave = {
  id: number;
  doctorId: number;
  startDate: string;
  endDate: string;
  reason: string;
};
