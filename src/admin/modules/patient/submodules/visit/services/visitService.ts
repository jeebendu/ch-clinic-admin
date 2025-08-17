
import http from "@/lib/JwtInterceptor";
import { getTenantId } from "@/utils/tenantUtils";
import { getEnvVariable } from "@/utils/envUtils";
import { Visit } from "../types/Visit";

const apiUrl = getEnvVariable('API_URL');

export interface VisitQueryParams {
  page: number;
  size: number;
  searchTerm?: string;
  status?: string[];
  visitType?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const visitService = {
  getAllVisits: async (page = 0, size = 10, searchTerm = '', filters?: any) => {
    try {
      const tenantId = getTenantId();
      const response = await http.post(`${apiUrl}/v1/visit/admin/filter/${page}/${size}`, {
        searchTerm,
        ...filters
      }, {
        headers: {
          'X-TENANT-ID': tenantId
        }
      });
      console.log("Raw Visit API response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching visits:", error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await http.get(`${apiUrl}/v1/visit/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching visit with ID ${id}:`, error);
      throw error;
    }
  },

  deleteById: async (id: number) => {
    try {
      const response = await http.get(`${apiUrl}/v1/visit/delete/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting visit with ID ${id}:`, error);
      throw error;
    }
  },

  saveOrUpdate: async (visit: Partial<Visit>) => {
    try {
      const response = await http.post(`${apiUrl}/v1/visit/saveOrUpdate`, visit);
      return response.data;
    } catch (error) {
      console.error("Error saving/updating visit:", error);
      throw error;
    }
  },

  searchVisits: async (searchTerm: string) => {
    try {
      const response = await http.get(`${apiUrl}/v1/visit/search`, {
        params: { term: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching visits:", error);
      throw error;
    }
  }
};

export default visitService;
