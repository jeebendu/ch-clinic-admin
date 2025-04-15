
import http from "@/lib/JwtInterceptor";
import { getTenantId } from "@/utils/tenantUtils";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

const PatientService = {
  list: async (page = 0, size = 10, searchTerm = "") => {
    try {
      const tenantId = getTenantId();
      const response = await http.get(`${apiUrl}/v1/patient/list`, {
        params: {
          page,
          size,
          search: searchTerm,
        },
        headers: {
          'X-TENANT-ID': tenantId
        }
      });
      console.log("Raw Patient API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching patients:", error);
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
