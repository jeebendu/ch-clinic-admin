import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const CategoryService = {


    deleteById: (id: number) => {
        return http.get(`${apiUrl}/v1/catalog/category/delete/id/${id}`);
    },

    list: async () => {
        try {
            const response = await http.get(`${apiUrl}/v1/catalog/category/list`);
            // console.log("Raw API response:", response);
            return response.data; // Return just the data part of the response
        } catch (error) {
            console.error("Error fetching Category:", error);
            throw error;
        }
    },


    saveOrUpdate: (category: any) => {
        return http.post(`${apiUrl}/v1/catalog/category/saveOrUpdate`, category);
    },



};


export default CategoryService;