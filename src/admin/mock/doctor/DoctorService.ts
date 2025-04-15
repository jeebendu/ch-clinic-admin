import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const DoctorService = {
  list: () => {
    return http.get(`${api}/v1/doctor/list`);
  },

  paginatedList: (pageNumber:any, pageSize:any, search:any) => {
    const searchPath = search ? `/${search}` : '';
    return http.get(`${api}/v1/doctor/list/${pageNumber}/${pageSize}${searchPath}`);
  },

  listAll: () => {
    return http.get(`${api}/v1/doctor/list/all`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/doctor/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/doctor/id/${id}`);
  },

  saveOrUpdate: (doctor:any) => {
    return http.post(`${api}/v1/doctor/saveOrUpdate`, doctor);
  },

  search: (search:any) => {
    return http.post(`${api}/v1/doctor/search`, search);
  },

  filter: (pageNumber:any, pageSize:any, search:any) => {
    return http.post(`${api}/v1/doctor/filter/${pageNumber}/${pageSize}`, search);
  },

  getReportByRefDrId: (searchReport:any) => {
    return http.post(`${api}/v1/schedule/refdr/list`, searchReport);
  },

  getScheduleCountList: (search:any) => {
    return http.post(`${api}/v1/schedule/count`, search);
  },
};