
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../../../types/Doctor";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { DoctorBreak } from "../types/DoctorAvailability";
import { Slot } from "@/admin/modules/appointments/types/Slot";

export const WeeklyScheduleService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number) => {
    try {
      return http.get(`/v1/doctor/weekly-schedule/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor breaks:", error);
      throw error;
    }
  },

  getSlotsByDoctorBranch: async (doctorBranchId: number, date?: Date): Promise<Slot[]> => {
    try {
      let url = `/v1/doctor/weekly-schedule/slots/doctor-branch/${doctorBranchId}`;
      if (date) {
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        url += `?date=${formattedDate}`;
      }
      const response = await http.get(url);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching slots:", error);
      throw error;
    }
  },

  generatePreviewSlots: async (doctorBranchId: number) => {
    try {
      return await http.post(`/v1/doctor/weekly-schedule/generate-preview-slots/${doctorBranchId}`);
    } catch (error) {
      console.error("Error generating preview slots:", error);
      throw error;
    }
  }
};
