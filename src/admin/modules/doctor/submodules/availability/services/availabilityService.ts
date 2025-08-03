
import { DoctorAvailability } from "../types/DoctorAvailability";
import http from "@/lib/JwtInterceptor";


const AvailabilityService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number) => {
    try {
      return http.get(`/v1/doctor/weekly-schedule/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      throw error;
    }
  },

    findAllByDoctorBranchId: async (drBranchId: number) => {
    try {
      return http.get(`/v1/doctor/weekly-schedule/doctor-branch/${drBranchId}`);
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      throw error;
    }
  },

  
  saveSchedule: async (availabilities: DoctorAvailability[],drBranchId:number) => {
    try {
      return http.post(`/v1/doctor/weekly-schedule/saveOrUpdate/doctor-branch/${drBranchId}`, availabilities);

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

export default AvailabilityService;
