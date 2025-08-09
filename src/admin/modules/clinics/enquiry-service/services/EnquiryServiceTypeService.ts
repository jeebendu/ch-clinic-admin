
import http from "@/lib/JwtInterceptor";
import uploadHttp from "@/lib/uploadHttp";
import { getEnvVariable } from "@/utils/envUtils";
import axios from "axios";

const apiUrl = getEnvVariable('API_URL');

export const EnquiryServiceTypeService = {
list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/enquiryServiceType/list`);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/enquiryServiceType/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/enquiryServiceType/id/${id}`);
  },

  saveOrUpdate: async (data: any) => {
    return http.post(`${apiUrl}/v1/enquiryServiceType/saveOrUpdate`, data);
  }


}
export default EnquiryServiceTypeService;
