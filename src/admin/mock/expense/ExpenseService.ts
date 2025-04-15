import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const ExpenseService = {
  getApproveList: () => {
    return [
      {
        id: 1,
        name: "Approved",
      },
      {
        id: 0,
        name: "Not Approved",
      },
    ];
  },

  list: () => {
    return http.get(`${api}/v1/expense/list`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/expense/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/expense/id/${id}`);
  },

  saveOrUpdate: (expense:any) => {
    return http.post(`${api}/v1/expense/saveOrUpdate`, expense);
  },

  approveById: (id:number) => {
    return http.get(`${api}/v1/expense/approve/id/${id}`);
  },

  dataImport: async (formData:any) => {
    try {
      const headers = {
        Accept: "application/json",
      };

      return await http.post(`${api}/v1/expense/import`, formData, { headers });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to import expense");
    }
  },

  filterProduct: (pageNumber:any, pageSize:any, searchObj:any) => {
    return http.post(`${api}/v1/expense/filter/${pageNumber}/${pageSize}`, searchObj);
  },
};