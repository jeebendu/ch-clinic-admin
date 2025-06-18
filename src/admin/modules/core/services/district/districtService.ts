import http from "@/lib/JwtInterceptor";
import { District } from "../../types/District";



const DistrictService = {
  listDistrict: () => {
    return http.get(`/v1/district/list`);
  },
  listByName: (name: String) => {
    if (!name) { return; }
    return http.get(`/v1/public/district/list/${name}`);
  },
  listByName: (name:String) => {
    if(!name){
      return;
    }
  return http.get(`/v1/district/list/${name}`);
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