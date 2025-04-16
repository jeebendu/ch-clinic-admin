import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const CourierService = {
  list: () => {
    return http.get(`${apiUrl}/v1/courier/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/courier/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/courier/id/${id}`);
  },

  saveOrUpdate: (courier: any) => {
    return http.post(`${apiUrl}/v1/courier/saveOrUpdate`, courier);
  },
};

export default CourierService;