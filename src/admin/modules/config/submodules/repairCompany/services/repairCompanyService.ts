import http from "@/lib/JwtInterceptor";
import { RepairCompany } from "../types/repairCompany";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl =getEnvVariable('API_URL');

export const RepairCompanyService = {
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/repair/company/delete/id/${id}`);
  },


  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/repair/company/list`);
      // console.log("Raw API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching Repair Company:", error);
      throw error;
    }
  },

  saveOrUpdate: (repairCompany: any) => {
    return http.post(`${apiUrl}/v1/repair/company/saveOrUpdate`, repairCompany);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/repair/company/id/${id}`);
  },
};

export default RepairCompanyService;