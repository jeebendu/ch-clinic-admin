
import axios from "axios";
import { DoctorAvailability } from "../types/DoctorAvailability";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import http from "@/lib/JwtInterceptor";


export const availabilityService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number) => {
    try {
      return http.get(`/v1/doctor/weekly-schedule/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      throw error;
    }
  },

  saveSchedule: async (availabilities: DoctorAvailability[]) => {
    try {
      return http.post(`/v1/doctor/weekly-schedule/saveOrUpdate`, availabilities);

    } catch (error) {
      console.error("Error saving doctor availability:", error);
      throw error;
    }
  },

  deleteAvailability: async (id: number): Promise<boolean> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.delete(
      //   `${apiUrl}/v1/doctor/availability/${id}`,
      //   { withCredentials: true }
      // );
      // return response.data.status;

      // Mock response for development
      console.log("Deleting availability:", id);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error deleting doctor availability:", error);
      throw error;
    }
  }
};
