
import axios from "axios";

interface ClinicHoliday {
  id: number;
  branchId: number;
  holidayDate: Date | string;
  reason: string;
}

// Mock data for development purposes
const mockHolidays: ClinicHoliday[] = [
  {
    id: 1,
    branchId: 1,
    holidayDate: new Date('2025-01-01'),
    reason: "New Year's Day"
  },
  {
    id: 2,
    branchId: 1,
    holidayDate: new Date('2025-12-25'),
    reason: "Christmas"
  }
];

export const holidayService = {
  getByBranch: async (branchId: number): Promise<ClinicHoliday[]> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.get(
      //   `${apiUrl}/v1/clinic/holiday/${branchId}`,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      return Promise.resolve(mockHolidays.filter(
        holiday => holiday.branchId === branchId
      ));
    } catch (error) {
      console.error("Error fetching branch holidays:", error);
      throw error;
    }
  },

  saveHoliday: async (holiday: Partial<ClinicHoliday>): Promise<ClinicHoliday> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.post(
      //   `${apiUrl}/v1/clinic/holiday/save`,
      //   holiday,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      console.log("Saving holiday:", holiday);
      return Promise.resolve({
        id: Math.floor(Math.random() * 1000),
        branchId: holiday.branchId!,
        holidayDate: holiday.holidayDate!,
        reason: holiday.reason!
      } as ClinicHoliday);
    } catch (error) {
      console.error("Error saving clinic holiday:", error);
      throw error;
    }
  },
  
  deleteHoliday: async (id: number): Promise<boolean> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.delete(
      //   `${apiUrl}/v1/clinic/holiday/${id}`,
      //   { withCredentials: true }
      // );
      // return response.data.status;

      // Mock response for development
      console.log("Deleting holiday:", id);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error deleting clinic holiday:", error);
      throw error;
    }
  }
};
