
import axios from "axios";
import { DoctorAvailability } from "../types/DoctorAvailability";

// Mock data for development purposes
const mockAvailabilities: DoctorAvailability[] = [
  {
    id: 1,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    branch: { id: 1, name: 'Main Branch' },
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true
  },
  {
    id: 2,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    branch: { id: 1, name: 'Main Branch' },
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true
  }
];

export const availabilityService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number): Promise<DoctorAvailability[]> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.get(
      //   `${apiUrl}/v1/doctor/availability/${doctorId}/${branchId}`,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      return Promise.resolve(mockAvailabilities.filter(
        avail => avail.doctor.id === doctorId && avail.branch.id === branchId
      ));
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      throw error;
    }
  },

  saveSchedule: async (availabilities: Partial<DoctorAvailability>[]): Promise<DoctorAvailability[]> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.post(
      //   `${apiUrl}/v1/doctor/availability/save`,
      //   availabilities,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      console.log("Saving schedule:", availabilities);
      return Promise.resolve(availabilities.map((avail, index) => ({
        id: index + 1,
        doctor: { id: avail.doctorId, firstname: 'Doctor', lastname: 'Name', uid: 'DR001', gender: 0 },
        branch: { id: avail.branchId, name: 'Branch Name' },
        dayOfWeek: avail.dayOfWeek!,
        startTime: avail.startTime!,
        endTime: avail.endTime!,
        isAvailable: true
      })) as DoctorAvailability[]);
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
