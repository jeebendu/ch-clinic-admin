import http from "@/lib/JwtInterceptor";
import { Staff, User } from "../types/User";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

const UserService = {
  
  paginatedList: (pageNumber: number, pageSize: number, search: string | null) => {
    const url = `${apiUrl}/v1/staff/list/${pageNumber}/${pageSize}`;
    return http.post(url, {
      search: search || null,
    });
  },

  getStaff: () => {
    return http.get(`${apiUrl}/v1/users/getstaff`);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/staff/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/staff/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/staff/id/${id}`);
  },

  saveOrUpdate: (userData: Staff) => {
    return http.post(`${apiUrl}/v1/staff/saveOrUpdate`, userData);
  },

  filter: (pageNumber: any, pageSize: any, search: any) => {
    const url = `${apiUrl}/v1/staff/filter/${pageNumber}/${pageSize}`;
    return http.post(url, search);
  },

  getStatus: () => {
    return [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
    ];
  },
};

export default UserService;