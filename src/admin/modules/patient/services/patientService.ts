
import http from "@/lib/JwtInterceptor";
import { getTenantId } from "@/utils/tenantUtils";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export interface PatientQueryParams {
  page: number;
  size: number;
  searchTerm?: string;
  gender?: string[];
  ageGroup?: string[];
  lastVisit?: string[];
  insuranceProvider?: string[];
}

export const fetchPatients = async (params: PatientQueryParams) => {
  try {
    const tenantId = getTenantId();
    const response = await http.get(`${apiUrl}/v1/patient/list`, {
      params: {
        page: params.page,
        size: params.size,
        search: params.searchTerm,
        gender: params.gender?.join(','),
        ageGroup: params.ageGroup?.join(','),
        lastVisit: params.lastVisit?.join(','),
        insuranceProvider: params.insuranceProvider?.join(','),
      },
      headers: {
        'X-TENANT-ID': tenantId
      }
    });
    return response;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
};

const PatientService = {
  list: async (page = 0, size = 10, searchTerm = "") => {
    const search = {
      inputValue: "",
    };
    try {
      const filter={
        inputValue:"",
      }
      const tenantId = getTenantId();
      const search={
        inputValue:""
      }
      const response = await http.post(`${apiUrl}/v1/patient/filter/${page}/${size}`,search);
      console.log("Raw Patient API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw error;
    }
  },

  searchPatients: async (searchTerm: string) => {
    try {
      const response = await http.get(`${apiUrl}/v1/patient/search`, {
        params: { term: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching patients:", error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await http.get(`${apiUrl}/v1/patient/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  },

  deleteById: async (id: number) => {
    try {
      const response = await http.get(`${apiUrl}/v1/patient/delete/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting patient with ID ${id}:`, error);
      throw error;
    }
  },

  saveOrUpdate: async (patient: any) => {
    try {
      const response = await http.post(`${apiUrl}/v1/patient/saveOrUpdate`, patient);
      return response.data;
    } catch (error) {
      console.error("Error saving/updating patient:", error);
      throw error;
    }
  }
};

export default PatientService;
