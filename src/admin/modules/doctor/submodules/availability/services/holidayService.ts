import http from "@/lib/JwtInterceptor";
import { ClinicHoliday } from "../types/DoctorAvailability";


export const holidayService = {
  getByBranch: async (branchId: number) => {
    try {
      return http.get(`/v1/api/clinic-holidday/branch/id/${branchId}`)
    } catch (error) {
      console.error("Error fetching branch holidays:", error);
      throw error;
    }
  },

  saveHoliday: async (holiday: ClinicHoliday) => {
    try {
      return http.post(`/v1/api/clinic-holidday/saveOrUpdate`, holiday)
    } catch (error) {
      console.error("Error saving clinic holiday:", error);
      throw error;
    }
  },

  deleteHoliday: async (id: number) => {
    try {
      return http.delete(`/v1/api/clinic-holidday/delete/id/${id}`)
    } catch (error) {
      console.error("Error deleting clinic holiday:", error);
      throw error;
    }
  }
};
