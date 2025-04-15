import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const PatientServiceTypeService = {
  list: () => {
    return http.get(`${api}/v1/service/handler/list`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/service/handler/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/service/handler/id/${id}`);
  },

  getByPatientId: (id:number) => {
    return http.get(`${api}/v1/service/handler/patient/id/${id}`);
  },

  saveOrUpdate: (specialization:any) => {
    return http.post(`${api}/v1/service/handler/saveOrUpdate`, specialization);
  },
};