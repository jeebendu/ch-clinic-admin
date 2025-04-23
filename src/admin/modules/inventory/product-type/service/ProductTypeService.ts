import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const ProductTypeService = {


    deleteById: (id: number) => {
        return http.get(`${apiUrl}/v1/catalog/type/delete/id/${id}`);
    },

    list: async () => {
        try {
            const response = await http.get(`${apiUrl}/v1/catalog/type/list`);
            // console.log("Raw API response:", response);
            return response.data; // Return just the data part of the response
        } catch (error) {
            console.error("Error fetching Product Type:", error);
            throw error;
        }
    },


    saveOrUpdate: (productType: any) => {
        return http.post(`${apiUrl}/v1/catalog/type/saveOrUpdate`, productType);
    },



};


export default ProductTypeService;