
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";

// Real implementation would use these endpoints
const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await http.get<Doctor[]>('/v1/doctor');
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Fallback to mock data for development
      const { DoctorMockService } = await import("./doctorMockService");
      return DoctorMockService.getAllDoctors();
    }
  },

  getDoctorById: async (id: number): Promise<Doctor> => {
    try {
      const response = await http.get<Doctor>(`/v1/doctor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor with ID ${id}:`, error);
      // Fallback to mock data for development
      const { DoctorMockService } = await import("./doctorMockService");
      return DoctorMockService.getDoctorById(id);
    }
  },

  createDoctor: async (doctor: Doctor): Promise<Doctor> => {
    try {
      const response = await http.post<Doctor>('/v1/doctor', doctor);
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }
  },

  updateDoctor: async (doctor: Doctor): Promise<Doctor> => {
    try {
      const response = await http.put<Doctor>(`/v1/doctor/${doctor.id}`, doctor);
      return response.data;
    } catch (error) {
      console.error(`Error updating doctor with ID ${doctor.id}:`, error);
      throw error;
    }
  },

  deleteDoctor: async (id: number): Promise<void> => {
    try {
      await http.delete(`/v1/doctor/${id}`);
    } catch (error) {
      console.error(`Error deleting doctor with ID ${id}:`, error);
      throw error;
    }
  }
};

export default doctorService;
