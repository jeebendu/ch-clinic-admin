import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const DoctorPercentageService = {
  list: () => {
    return http.get(`${api}/v1/percentage/list`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/percentage/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/percentage/id/${id}`);
  },

  getPercentageByDoctorId: (id:number) => {
    return http.get(`${api}/v1/percentage/doctor/id/${id}`);
  },

  saveOrUpdate: (doctorPercentage:any) => {
    return http.post(`${api}/v1/percentage/saveOrUpdate`, doctorPercentage);
  },

  getPercentageByDoctorIdAndName: (id:number, name:string) => {
    return http.get(`${api}/v1/percentage/id/${id}/name/${name}`);
  },
};