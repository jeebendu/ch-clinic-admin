import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const BrandService = {


    deleteById: (id: number) => {
        return http.get(`${apiUrl}/v1/catalog/brand/delete/id/${id}`);
    },

    list: async () => {
        try {
            const response = await http.get(`${apiUrl}/v1/catalog/brand/list`);
            // console.log("Raw API response:", response);
            return response.data; // Return just the data part of the response
        } catch (error) {
            console.error("Error fetching Brand:", error);
            throw error;
        }
    },


    saveOrUpdate: (brand: any) => {
        return http.post(`${apiUrl}/v1/catalog/brand/saveOrUpdate`, brand);
    },



};


export default BrandService;