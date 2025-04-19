import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const CourierService = {

  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/courier/list`);
      // console.log("Raw API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching Courier:", error);
      throw error;
    }
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/courier/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/courier/id/${id}`);
  },

  saveOrUpdate: (courier: any) => {
    return http.post(`${apiUrl}/v1/courier/saveOrUpdate`, courier);
  },
};

export default CourierService;