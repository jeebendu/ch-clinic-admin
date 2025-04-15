import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const StatusService = {
  list: () => {
    return http.get(`${apiUrl}/api/status/list`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/api/status/id/${id}`);
  },

  saveOrUpdate: (status: any) => {
    return http.post(`${apiUrl}/api/status/saveOrUpdate`, status);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/api/status/delete/id/${id}`);
  },
};

export default StatusService;