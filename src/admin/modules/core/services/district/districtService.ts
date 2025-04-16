import http from "@/lib/JwtInterceptor";
import { District } from "../../types/District";

const apiUrl = process.env.REACT_APP_API_URL;

const DistrictService = {
  listDistrict: () => {
    return http.get(`${apiUrl}/v1/district/list`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/district/id/${id}`);
  },

  saveOrUpdate: (data: District) => {
    return http.post(`${apiUrl}/v1/district/saveOrUpdate`, data);
  },

  delete: (id: number) => {
    return http.delete(`${apiUrl}/v1/district/delete/id/${id}`);
  },

  getDistrictByStateId: (sid: number) => {
    return http.get(`${apiUrl}/v1/district/state/id/${sid}`);
  },
};

export default DistrictService;