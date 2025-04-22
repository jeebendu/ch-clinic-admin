import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";
import { isProduction } from "@/utils/envUtils";
import { DoctorMockService } from "./doctorMockService";

// Define a type for the paginated response
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page number (0-based index)
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

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

  fetchPaginated: (
    page: number,
    size: number,
    filter: { value: string; doctorType: string | null; specialization: string | null }
  ): Promise<PaginatedResponse<Doctor>> => {
    const mockDoctors = DoctorMockService.generateMockDoctors(size);

    // Apply filtering logic (if needed)
    const filteredDoctors = mockDoctors.filter((doctor) => {
      const matchesValue = filter.value
        ? doctor.firstname.includes(filter.value) || doctor.lastname.includes(filter.value)
        : true;
      const matchesDoctorType = filter.doctorType ? doctor.desgination === filter.doctorType : true;
      const matchesSpecialization = filter.specialization
        ? doctor.specializationList.some((spec) => spec.name === filter.specialization)
        : true;

      return matchesValue && matchesDoctorType && matchesSpecialization;
    });

    const totalElements = filteredDoctors.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;

    const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

    return Promise.resolve({
      content: paginatedDoctors,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page === totalPages - 1,
      numberOfElements: paginatedDoctors.length,
    });
  }
};

export default DoctorService;