import http from "@/lib/JwtInterceptor";
import { District } from "../../types/District";



const DistrictService = {
  listDistrict: () => {
    return http.get(`/v1/district/list`);
  },

  getById: (id: number) => {
    return http.get(`/v1/district/id/${id}`);
  },

  saveOrUpdate: (data: District) => {
    return http.post(`/v1/district/saveOrUpdate`, data);
  },

  delete: (id: number) => {
    return http.delete(`/v1/district/delete/id/${id}`);
  },

  getDistrictByStateId: (sid: number) => {
    return http.get(`/v1/district/state/id/${sid}`);
  },
};

export default DistrictService;