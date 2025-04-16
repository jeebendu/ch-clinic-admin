import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const RepairCompanyService = {
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/repair/company/delete/id/${id}`);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/repair/company/list`);
  },

  saveOrUpdate: (repairCompany: any) => {
    return http.post(`${apiUrl}/v1/repair/company/saveOrUpdate`, repairCompany);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/repair/company/id/${id}`);
  },
};

export default RepairCompanyService;