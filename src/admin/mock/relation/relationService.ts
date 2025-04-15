import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const RelationService = {
  list: () => {
    return http.get(`${apiUrl}/v1/relationship/list`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/relationship/id/${id}`);
  },

  saveOrUpdate: (data: any) => {
    return http.post(`${apiUrl}/v1/relationship/saveOrUpdate`, data);
  },

  delete: (id: number) => {
    return http.delete(`${apiUrl}/v1/relationship/delete/id/${id}`);
  },
};

export default RelationService;