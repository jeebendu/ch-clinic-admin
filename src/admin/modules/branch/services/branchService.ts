
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const BranchService = {
  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/branch/list`);
      console.log("Raw API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/branch/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/branch/id/${id}`);
  },

  saveOrUpdate: (branch: any) => {
    return http.post(`${apiUrl}/v1/branch/saveOrUpdate`, branch);
  },
};

export default BranchService;
