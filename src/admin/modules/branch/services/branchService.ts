
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { Branch } from "../types/Branch";

const apiUrl = getEnvVariable('API_URL');
 const BranchService = {
  list: () => {
    return http.get<Branch[]>(`${apiUrl}/v1/branch/list`);
  },

  deleteById: (id: number) => {
    return http.get<any>(`${apiUrl}/v1/branch/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get<Branch>(`${apiUrl}/v1/branch/id/${id}`);
  },

  saveOrUpdate: (branch: any) => {
    return http.post<any>(`${apiUrl}/v1/branch/saveOrUpdate`, branch);
  }
};

export default BranchService;