
import http from "@/lib/JwtInterceptor";
import uploadHttp from "@/lib/uploadHttp";
import { getEnvVariable } from "@/utils/envUtils";
import axios from "axios";

const apiUrl = getEnvVariable('API_URL');

export const EnquiryServiceTypeMapService = {

  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/api/clinic-service/list`);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  },

  deleteById: (id: number) => {
    return http.delete(`${apiUrl}/v1/api/clinic-service/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/api/clinic-service/id/${id}`);
  },

  saveOrUpdate: async (data: any) => {
    return http.post(`${apiUrl}/v1/api/clinic-service/saveOrUpdate`, data);
  }

  
}
export default EnquiryServiceTypeMapService;
