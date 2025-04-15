import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const DistributorService = {
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/vendor/delete/id/${id}`);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/vendor/list`);
  },

  saveOrUpdate: (distributor: { id: number; name?: string; contact?: string; address?: string }) => {
    return http.post(`${apiUrl}/v1/vendor/saveOrUpdate`, distributor);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/vendor/id/${id}`);
  },
};

export default DistributorService;