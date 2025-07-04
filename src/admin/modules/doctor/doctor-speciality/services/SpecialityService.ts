
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import axios from "axios";

const apiUrl = getEnvVariable('API_URL');

export const SpecialityService = {
  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/public/doctor/specialization/list`);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  },

  deleteById: (id: number) => {
    return http.delete(`${apiUrl}/v1/public/doctor/specialization/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/public/doctor/specialization/id/${id}`);
  },

  saveOrUpdate: async (data: FormData) => {
    console.log("Sending data to API:", data);
    for (let pair of data.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }
    return axios.post(`${apiUrl}/v1/public/doctor/specialization/saveOrUpdate`, data);
  },
}
export default SpecialityService;
