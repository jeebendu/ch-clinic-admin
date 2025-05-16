
import axios from "axios";
import { DoctorLeave } from "../types/DoctorAvailability";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";

// Mock data for development purposes
const mockLeaves: DoctorLeave[] = [
  {
    id: 1,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    startDate: new Date("2023-12-25"),
    endDate: new Date("2023-12-26"),
    reason: "Christmas Holiday"
  },
  {
    id: 2,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-01"),
    reason: "New Year's Day"
  }
];

export const leaveService = {
  getByDoctor: async (doctorId: number): Promise<DoctorLeave[]> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.get(
      //   `${apiUrl}/v1/doctor/leave/${doctorId}`,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      return Promise.resolve(mockLeaves.filter(
        leave => leave.doctor.id === doctorId
      ));
    } catch (error) {
      console.error("Error fetching doctor leaves:", error);
      throw error;
    }
  },

  saveLeave: async (leave: Partial<DoctorLeave>): Promise<DoctorLeave> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.post(
      //   `${apiUrl}/v1/doctor/leave/save`,
      //   leave,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      console.log("Saving leave:", leave);
      return Promise.resolve({
        id: Math.floor(Math.random() * 1000),
        doctor: leave.doctor as Doctor,
        startDate: leave.startDate as Date,
        endDate: leave.endDate as Date,
        reason: leave.reason || ""
      });
    } catch (error) {
      console.error("Error saving doctor leave:", error);
      throw error;
    }
  },
  
  deleteLeave: async (id: number): Promise<boolean> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.delete(
      //   `${apiUrl}/v1/doctor/leave/${id}`,
      //   { withCredentials: true }
      // );
      // return response.data.status;

      // Mock response for development
      console.log("Deleting leave:", id);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error deleting doctor leave:", error);
      throw error;
    }
  }
};
