import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";
import { isProduction } from "@/utils/envUtils";
import { PaginatedResponse } from "@/types/common";
import { DoctorsFilter } from "../hooks/useDoctors";
import axios from "axios";
import uploadHttp from "@/lib/uploadHttp";

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
    const response = await http.get<Doctor>(`/v1/doctor/id/${id}`);
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

  saveOrUpdate: async (doctor: FormData): Promise<any> => {
    try {

 for (const [key, value] of doctor.entries()) {
  if (value instanceof Blob) {
    console.log(`${key}: Blob - ${value.type}, size: ${value.size}`);
  } else {
    console.log(`${key}:`, value);
  }
}

      const response = await uploadHttp.post('/v1/doctor/saveOrUpdate', doctor);
      // console.log(response.status, response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving doctor:", error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/v1/doctor/id/${id}`);
  },

  deleteById: async (id: number): Promise<any> => {
    try {
      const response = await http.delete(`/v1/doctor/id/${id}`);
      return { status: true };
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return { status: false };
    }
  },

  publishDoctorOnline: async (id: number) => {
    return await http.get(`/v1/doctor/publish-online/doctor/${id}`);
  },

  fetchPaginated: async (
    page: number,
    size: number,
    filter: DoctorsFilter
  ): Promise<PaginatedResponse<Doctor>> => {
    const filterObj: any = {
      value: filter.searchTerm || null,
      doctorType: filter.doctorType || null,
      specializationId: filter.specialization || null,
    }

    const response = await http.post<PaginatedResponse<Doctor>>(
      `/v1/doctor/admin/filter/${page}/${size}`,
      filterObj
    );
    return response.data;
  }
};

export default DoctorService;
