
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";
import { isProduction } from "@/utils/envUtils";
import { DoctorMockService } from "./doctorMockService";
import { PaginatedResponse } from "@/types/common";

// Real implementation would use these endpoints
 const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await http.get<Doctor[]>('/v1/doctor/list');
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Fallback to mock data for development
      const { DoctorMockService } = await import("./doctorMockService");
      return DoctorMockService.list();
    }
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await http.get<Doctor>(`/v1/doctor/${id}`);
    return response.data;
  },

   saveOrUpdateDoctor: async (doctor: Doctor): Promise<any> => {
    try {
      const response = await http.post<any>('/v1/doctor/saveOrUpdate', doctor);
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }
  },

  // updateDoctor: async (doctor: Doctor): Promise<Doctor> => {
  //   try {
  //     const response = await http.put<Doctor>(`/v1/doctor/${doctor.id}`, doctor);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error updating doctor with ID ${doctor.id}:`, error);
  //     throw error;
  //   }
  // },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/v1/doctor/${id}`);
  },

  fetchPaginated: async (
    page: number,
    size: number,
    filter: { value: string|null; doctorType: boolean | null; specialization: string | null }
  ): Promise<PaginatedResponse<Doctor>> => {
    if (!isProduction()) {
      const { DoctorMockService } = await import("./doctorMockService");
      return DoctorMockService.fetchPaginated(page, size, filter);
    }
    const response = await http.post<PaginatedResponse<Doctor>>(
      `/v1/doctor/filter/${page}/${size}`,
      filter
    );
    return response.data;
  }
};


export default doctorService;