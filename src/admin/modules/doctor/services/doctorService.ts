import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";
import { isProduction } from "@/utils/envUtils";
import { PaginatedResponse } from "@/types/common";

// Real implementation would use these endpoints
const DoctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await http.get<Doctor[]>('/v1/doctor/list');
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
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

  delete: async (id: number): Promise<void> => {
    await http.delete(`/v1/doctor/${id}`);
  },

  fetchPaginated: async (
    page: number,
    size: number,
    filter: { value: string | null; doctorType: boolean | null; specialization: string | null }
  ): Promise<PaginatedResponse<Doctor>> => {
    const response = await http.post<PaginatedResponse<Doctor>>(
      `/v1/doctor/filter/${page}/${size}`,
      filter
    );
    return response.data;
  }
};

export default DoctorService;