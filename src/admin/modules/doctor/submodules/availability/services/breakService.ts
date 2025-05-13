
import axios from "axios";

interface DoctorBreak {
  id?: number;
  doctorId: number;
  branchId: number;
  dayOfWeek: number;
  breakStart: string;
  breakEnd: string;
  description: string;
}

// Mock data for development purposes
const mockBreaks: DoctorBreak[] = [
  {
    id: 1,
    doctorId: 1,
    branchId: 1,
    dayOfWeek: 1, // Monday
    breakStart: "12:00",
    breakEnd: "13:00",
    description: "Lunch Break"
  },
  {
    id: 2,
    doctorId: 1,
    branchId: 1,
    dayOfWeek: 2, // Tuesday
    breakStart: "12:00",
    breakEnd: "13:00",
    description: "Lunch Break"
  }
];

export const breakService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number): Promise<DoctorBreak[]> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.get(
      //   `${apiUrl}/v1/doctor/break/${doctorId}/${branchId}`,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      return Promise.resolve(mockBreaks.filter(
        breakItem => breakItem.doctorId === doctorId && breakItem.branchId === branchId
      ));
    } catch (error) {
      console.error("Error fetching doctor breaks:", error);
      throw error;
    }
  },

  saveBreaks: async (breaks: Partial<DoctorBreak>[]): Promise<DoctorBreak[]> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.post(
      //   `${apiUrl}/v1/doctor/break/save`,
      //   breaks,
      //   { withCredentials: true }
      // );
      // return response.data.response;

      // Mock response for development
      console.log("Saving breaks:", breaks);
      return Promise.resolve(breaks.map((breakItem, index) => ({
        id: index + 1,
        doctorId: breakItem.doctorId!,
        branchId: breakItem.branchId!,
        dayOfWeek: breakItem.dayOfWeek!,
        breakStart: breakItem.breakStart!,
        breakEnd: breakItem.breakEnd!,
        description: breakItem.description || "Break"
      })) as DoctorBreak[]);
    } catch (error) {
      console.error("Error saving doctor breaks:", error);
      throw error;
    }
  },
  
  deleteBreak: async (id: number): Promise<boolean> => {
    try {
      // Uncomment for real API integration
      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await axios.delete(
      //   `${apiUrl}/v1/doctor/break/${id}`,
      //   { withCredentials: true }
      // );
      // return response.data.status;

      // Mock response for development
      console.log("Deleting break:", id);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error deleting doctor break:", error);
      throw error;
    }
  }
};
