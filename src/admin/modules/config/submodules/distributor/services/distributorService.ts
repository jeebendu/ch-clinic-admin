import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const DistributorService = {
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/vendor/delete/id/${id}`);
  },

  list: async () => {
      try {
        const response = await http.get(`${apiUrl}/v1/vendor/list`);
        // console.log("Raw API response:", response);
        return response.data; // Return just the data part of the response
      } catch (error) {
        console.error("Error fetching Distributor:", error);
        throw error;
      }
    },


  saveOrUpdate: (distributor: any) => {
    return http.post(`${apiUrl}/v1/vendor/saveOrUpdate`, distributor);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/vendor/id/${id}`);
  },
};

export default DistributorService;