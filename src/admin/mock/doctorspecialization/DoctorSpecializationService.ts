import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const DoctorSpecializationService = {
  list: () => {
    return http.get(`${api}/v1/doctor-specialization/list`);
  },

  deleteById: (id:number) => {
    return http.delete(`${api}/v1/doctor-specialization/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/doctor-specialization/id/${id}`);
  },

  saveOrUpdate: (doctorSpecialization:any) => {
    return http.post(`${api}/v1/doctor-specialization/saveOrUpdate`, doctorSpecialization);
  },

  getSpecializationByDoctorId: (id:number) => {
    return http.get(`${api}/v1/doctor-specialization/doctor/id/${id}`);
  },

  getSpecializationByDoctorIdAndName: (id:number, name:string) => {
    console.log(id, name);
    return http.get(`${api}/v1/doctor-specialization/doctor/id/${id}/name/${name}`);
  },
};