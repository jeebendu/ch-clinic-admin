import { getEnvVariable } from "@/utils/envUtils";
import { MedicalCollege } from "../types/MedicalCollege";
import http from "@/lib/JwtInterceptor";

const apiUrl = getEnvVariable('API_URL');

export const MedicalCollegeService = {
  list: async (): Promise<MedicalCollege[]> => {
    try {
      const response = await http.get(`${apiUrl}/v1/medical/college/list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching medical colleges:", error);
      throw error;
    }
  },

  deleteById: async (id: number): Promise<void> => { 
    return http.delete(`${apiUrl}/v1/medical/college/delete/id/${id}`);
  },


//   getById: async (id: number): Promise<MedicalCollege> => {
//     const response = await http.get(`${apiUrl}/v1/medical/college/id/${id}`);
//     return response.data;
//   },

  saveOrUpdate: async (medicalCollege: MedicalCollege): Promise<any> => { // Adjust return type as needed
    return http.post(`${apiUrl}/v1/medical/college/saveOrUpdate`, medicalCollege);
  },
};

export default MedicalCollegeService;