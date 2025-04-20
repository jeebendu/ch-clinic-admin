
import http from "@/lib/JwtInterceptor";
import { Patient } from "../types/Patient";
import { isProduction } from "@/utils/envUtils";
import { PaginatedResponse } from "@/types/common";

// Import the mock service correctly
import patientMockService from "./patientMockService";

export const PatientService = {
  list: async (): Promise<Patient[]> => {
    if (!isProduction()) {
      return patientMockService.list();
    }
    const response = await http.get<Patient[]>('/v1/patient');
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await http.get<Patient>(`/v1/patient/${id}`);
    return response.data;
  },

  create: async (patient: Patient): Promise<Patient> => {
    const response = await http.post<Patient>('/v1/patient', patient);
    return response.data;
  },

  update: async (patient: Patient): Promise<Patient> => {
    const response = await http.put<Patient>(`/v1/patient/${patient.id}`, patient);
    return response.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await http.delete(`/v1/patient/${id}`);
  },

  fetchPaginated: async (
    page: number,
    size: number,
    filter: { value: string; status: string | null }
  ): Promise<PaginatedResponse<Patient>> => {
    if (!isProduction()) {
      return patientMockService.fetchPaginated(page, size, filter);
    }
    const response = await http.post<PaginatedResponse<Patient>>(
      `/v1/patient/filter/${page}/${size}`,
      filter
    );
    return response.data;
  }
};

export default PatientService;
