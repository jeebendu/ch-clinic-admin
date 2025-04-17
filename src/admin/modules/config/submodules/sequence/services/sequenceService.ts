import http from "@/lib/JwtInterceptor";
import { Sequence } from "../types/sequence";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const SequenceService = {
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/sequence/delete/id/${id}`);
  },
  
  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/sequence/list`);
      console.log("Sequence API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  },

  saveOrUpdate: (sequence: any) => {
    return http.post(`${apiUrl}/v1/sequence/saveOrUpdate`, sequence);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/sequence/id/${id}`);
  },
};

export default SequenceService;