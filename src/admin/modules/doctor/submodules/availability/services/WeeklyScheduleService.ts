import http from "@/lib/JwtInterceptor";
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { DoctorBreak } from "../types/DoctorAvailability";


export const WeeklyScheduleService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number) => {
    try {
      return http.get(`/v1/doctor/weekly-schedule/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor breaks:", error);
      throw error;
    }
  }
};
