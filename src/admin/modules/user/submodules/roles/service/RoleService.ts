
import http from '@/lib/JwtInterceptor';
import { getEnvVariable } from '@/utils/envUtils';
import { Role } from '../types/Role';

const apiUrl = getEnvVariable('API_URL');

export const RoleService = {
  list: async (): Promise<Role[]> => {
    const response = await http.get<Role[]>(`${apiUrl}/v1/users/role/list`);
    return response.data;
  },

  listByType: async (type: string): Promise<Role[]> => {
    const response = await http.get<Role[]>(`${apiUrl}/v1/users/role/list/type/${type}`);
    return response.data;
  },

  deleteById: async (id: number): Promise<any> => {
    const response = await http.get<any>(`${apiUrl}/v1/users/role/delete/id/${id}`);
    return response.data;
  },

  getById: async (id: number): Promise<Role> => {
    const response = await http.get<Role>(`${apiUrl}/v1/users/role/id/${id}`);
    return response.data;
  },

  saveOrUpdate: async (role: Role): Promise<any> => {
    const response = await http.post<any>(`${apiUrl}/v1/users/role/saveOrUpdate`, role);
    return response.data;
  },
};