import http from "@/lib/JwtInterceptor";
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { DoctorBreak } from "../types/DoctorAvailability";


export const breakService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number) => {
    try {
      return http.get(`/v1/doctor/schedule-break/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor breaks:", error);
      throw error;
    }
  },

  saveBreaks: async (breaks: Partial<DoctorBreak>[]) => {
    try {
      return http.post("/v1/doctor/schedule-break/saveOrUpdate", breaks)
    } catch (error) {
      console.error("Error saving doctor breaks:", error);
      throw error;
    }
  },

  deleteById: async (id: number) => {
    try {
      return http.delete(`/v1/doctor/schedule-break/delete/id/${id}`)
    } catch (error) {
      console.error("Error deleting doctor break:", error);
      throw error;
    }
  }
};
