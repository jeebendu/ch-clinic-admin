import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const SourceService = {
  list: () => {
    return http.get(`${apiUrl}/api/source/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/api/source/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/api/source/id/${id}`);
  },

  saveOrUpdate: (source: any) => {
    return http.post(`${apiUrl}/api/source/saveOrUpdate`, source);
  },
};

export default SourceService;