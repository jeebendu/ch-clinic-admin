
import axios from "axios";
import { DoctorAvailability } from "../types/DoctorAvailability";
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";

// Mock data for development purposes
const mockAvailabilities: DoctorAvailability[] = [
  {
    id: 1,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    branch: { 
      id: 1, 
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      state: { id: 1, name: 'State', country: { id: 1, name: 'Country', code: 'CTR' } },
      district: { id: 1, name: 'District', state: { id: 1, name: 'State', country: { id: 1, name: 'Country', code: 'CTR' } } },
      pincode: '123456',
      address: 'Street Address',
      companyContact: '123-456-7890'
    },
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true
  },
  {
    id: 2,
    doctor: { id: 1, firstname: 'John', lastname: 'Doe', uid: 'DR001', gender: 0 },
    branch: { 
      id: 1, 
      name: 'Main Branch',
      code: 'MB001',
      location: 'Downtown',
      state: { id: 1, name: 'State', country: { id: 1, name: 'Country', code: 'CTR' } },
      district: { id: 1, name: 'District', state: { id: 1, name: 'State', country: { id: 1, name: 'Country', code: 'CTR' } } },
      pincode: '123456',
      address: 'Street Address',
      companyContact: '123-456-7890'
    },
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
        doctor: avail.doctor as Doctor,
        branch: avail.branch as Branch,
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
