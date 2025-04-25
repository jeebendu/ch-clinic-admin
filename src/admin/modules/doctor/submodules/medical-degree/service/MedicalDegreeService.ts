import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { MedicalDegree } from "../types/MedicalDegree";

const apiUrl = getEnvVariable('API_URL');

export const MedicalDegreeService = {
  list: async (): Promise<MedicalDegree[]> => {
    try {
      const response = await http.get(`${apiUrl}/v1/medical/degree/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching medical degree:", error);
      throw error;
    }
  },

  deleteById: async (id: number): Promise<void> => { 
    return http.delete(`${apiUrl}/v1/medical/degree/delete/id/${id}`);
  },


  getById: async (id: number): Promise<MedicalDegree> => {
    const response = await http.get(`${apiUrl}/v1/medical/degree/id/${id}`);
    return response.data;
  },

  saveOrUpdate: async (medicalDegree: MedicalDegree): Promise<any> => { // Adjust return type as needed
    return http.post(`${apiUrl}/v1/medical/degree/saveOrUpdate`, medicalDegree);
  },
};

export default MedicalDegreeService;