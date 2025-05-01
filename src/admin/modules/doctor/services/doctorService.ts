
import { Doctor } from "../types/Doctor";
import http from "@/lib/JwtInterceptor";
import { PaginatedResponse } from "@/types/common";
import doctorMockService from "./doctorMockService";

// We'll use mock service for development
const isDevelopment = true;

const DoctorService = {
  /**
   * Get a list of all doctors
   */
  getDoctors: async (): Promise<Doctor[]> => {
    if (isDevelopment) {
      return doctorMockService.getDoctors();
    }
    
    const response = await http.get<Doctor[]>("/api/doctors");
    return response.data;
  },

  /**
   * Get a doctor by ID
   */
  getDoctorById: async (id: number): Promise<Doctor> => {
    if (isDevelopment) {
      return doctorMockService.getDoctorById(id);
    }
    
    const response = await http.get<Doctor>(`/api/doctors/${id}`);
    return response.data;
  },

  /**
   * Get paginated doctors list
   */
  getPaginatedDoctors: async (
    page: number,
    pageSize: number,
    filters?: any
  ): Promise<PaginatedResponse<Doctor>> => {
    if (isDevelopment) {
      // Mock implementation for pagination
      const doctors = await doctorMockService.getDoctors();
      
      const filteredDoctors = doctors;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        content: filteredDoctors.slice(start, end),
        totalElements: filteredDoctors.length,
        number: page,
        size: pageSize,
        totalPages: Math.ceil(filteredDoctors.length / pageSize),
        first: page === 1,
        last: page === Math.ceil(filteredDoctors.length / pageSize),
        numberOfElements: filteredDoctors.slice(start, end).length,
        empty: filteredDoctors.length === 0,
      };
    }
    
    const response = await http.get<PaginatedResponse<Doctor>>(
      `/api/doctors?page=${page - 1}&size=${pageSize}`
    );
    return response.data;
  }
};

export default DoctorService;
