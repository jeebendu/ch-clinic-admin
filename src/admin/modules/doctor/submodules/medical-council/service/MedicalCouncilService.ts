import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { MedicalCouncil } from "../types/MedicalCouncil";

const apiUrl = getEnvVariable('API_URL');

export const MedicalCouncilService = {
  list: async (): Promise<MedicalCouncil[]> => {
    try {
      const response = await http.get(`${apiUrl}/v1/medical/council/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching medical councils:", error);
      throw error;
    }
  },

  deleteById: async (id: number): Promise<void> => { 
    return http.delete(`${apiUrl}/v1/medical/council/delete/id/${id}`);
  },


  getById: async (id: number): Promise<MedicalCouncil> => {
    const response = await http.get(`${apiUrl}/v1/medical/council/id/${id}`);
    return response.data;
  },

  saveOrUpdate: async (medicalCouncil: MedicalCouncil): Promise<any> => { // Adjust return type as needed
    return http.post(`${apiUrl}/v1/medical/council/saveOrUpdate`, medicalCouncil);
  },
};

export default MedicalCouncilService;