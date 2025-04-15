
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const BranchService = {
  list: () => {
    return http.get(`${apiUrl}/v1/branch/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/branch/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/branch/id/${id}`);
  },

  saveOrUpdate: (branch: any) => {
    return http.post(`${apiUrl}/v1/branch/saveOrUpdate`, branch);
  },
};

export default BranchService;
