
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { Role } from "../submodules/roles/types/Role";

const apiUrl = getEnvVariable('API_URL');

export const RoleService = {
  list: () => {
    return http.get<Role[]>(`${apiUrl}/v1/role/list`);
  },

  deleteById: (id: number) => {
    return http.get<any>(`${apiUrl}/v1/role/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get<Role>(`${apiUrl}/v1/role/id/${id}`);
  },

  saveOrUpdate: (role: Role) => {
    return http.post<any>(`${apiUrl}/v1/role/saveOrUpdate`, role);
  }
};
