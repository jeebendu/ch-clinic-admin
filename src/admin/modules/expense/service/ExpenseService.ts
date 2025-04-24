
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { Expense } from "../types/Expense";
 
const apiUrl = getEnvVariable('API_URL');
 
const ExpenseService = {
  getApproveList: () => {
    return [
      { id: 1, name: "Approved" },
      { id: 0, name: "Not Approved" },
    ];
  },
 
  list: () => {
    return http.get(`${apiUrl}/v1/expense/list`);
  },
 
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/expense/delete/id/${id}`);
  },
 
  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/expense/id/${id}`);
  },
 
  saveOrUpdate: (expense: Expense) => {
    return http.post(`${apiUrl}/v1/expense/saveOrUpdate`, expense);
  },
 
  approveById: (id: number) => {
    return http.get(`${apiUrl}/v1/expense/approve/id/${id}`);
  },
 
  dataImport: (formData: FormData) => {
    try {
      const headers = { Accept: "application/json" };
      return http.post(`${apiUrl}/v1/expense/import`, formData, { headers });
    } catch (e) {
      console.error(e);
      throw new Error("Failed to import expense");
    }
  },
 
  filterProduct: (pageNumber: number, pageSize: number, searchObj: any) => {
    return http.post(`${apiUrl}/v1/expense/filter/${pageNumber}/${pageSize}`, null);
  },
};
 
export default ExpenseService;
