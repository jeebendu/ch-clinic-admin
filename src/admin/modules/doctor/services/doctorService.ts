
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";
import { isProduction } from "@/utils/envUtils";
import { DoctorMockService } from "./doctorMockService";
import { PaginatedResponse } from "@/types/common";

export const DoctorService = {
  list: async (): Promise<Doctor[]> => {
    if (!isProduction()) {
      const { DoctorMockService } = await import("./doctorMockService");
      return DoctorMockService.list();
    }
    const response = await http.get<Doctor[]>('/v1/doctor');
    return response.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await http.get<Doctor>(`/v1/doctor/${id}`);
    return response.data;
  },

  create: async (doctor: Doctor): Promise<Doctor> => {
    const response = await http.post<Doctor>('/v1/doctor', doctor);
    return response.data;
  },

  update: async (doctor: Doctor): Promise<Doctor> => {
    const response = await http.put<Doctor>(`/v1/doctor/${doctor.id}`, doctor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/v1/doctor/${id}`);
  },

  fetchPaginated: async (
    page: number,
    size: number,
    filter: { value: string; doctorType: string | null; specialization: string | null }
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

export default DoctorService;
