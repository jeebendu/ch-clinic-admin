
import axios from "axios";
import { DoctorLeave } from "../types/DoctorAvailability";

// Mock data for development purposes
const mockLeaves: DoctorLeave[] = [
  {
    id: 1,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    startDate: new Date('2025-05-20'),
    endDate: new Date('2025-05-22'),
    reason: "Vacation"
  },
  {
    id: 2,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    startDate: new Date('2025-06-10'),
    endDate: new Date('2025-06-15'),
    reason: "Conference"
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
        doctor: { id: leave.doctorId!, firstname: 'Doctor', lastname: 'Name', uid: 'DR001', gender: 0 },
        startDate: leave.startDate!,
        endDate: leave.endDate!,
        reason: leave.reason || ""
      } as DoctorLeave);
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
