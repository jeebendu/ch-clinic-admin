import http from "@/lib/JwtInterceptor";


const apiUrl = process.env.REACT_APP_API_URL;

export const PatientService = {
  search: (searchItem:any) => {
    return http.post(`${apiUrl}/v1/patient/search`, searchItem);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/patient/list`);
  },

  deleteById: (id:number) => {
    return http.get(`${apiUrl}/v1/patient/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${apiUrl}/v1/patient/id/${id}`);
  },

  saveOrUpdate: (patient:any) => {
    return http.post(`${apiUrl}/v1/patient/saveOrUpdate`, patient);
  },

  paginatedList: (pageNumber:any, pageSize:any, search:any) => {
    const searchPath = search ? `/${search}` : '';
    return http.get(`${apiUrl}/v1/patient/list/${pageNumber}/${pageSize}${searchPath}`);
  },

  changeBranchByPatientIds: (patientIds:any, branchId:any) => {
    return http.post(`${apiUrl}/v1/patient/changeBranch/${branchId}`, patientIds);
  },

  filter: (pageNumber:any, pageSize:any, search:any) => {
    return http.post(`${apiUrl}/v1/patient/filter/${pageNumber}/${pageSize}`, search);
  },
};