import http from "@/lib/JwtInterceptor";
import { Customer, CustomerLedger } from "./Customer";


const api = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Replace with your API URL

export const CustomerService = {
  list: (): Promise<any> => {
    return http.get<Customer[]>(`${api}/v1/customer/list`);
  },

  deleteById: (id: number): Promise<any> => {
    return http.get(`${api}/v1/customer/delete/id/${id}`);
  },

  getById: (id: number): Promise<any> => {
    return http.get<Customer>(`${api}/v1/customer/id/${id}`);
  },

  searchByMobile: (phone: string): Promise<any> => {
    return http.post<Customer>(`${api}/v1/customer/search`, { phone });
  },

  findLedgByCId: (cId: number): Promise<any> => {
    return http.get<CustomerLedger[]>(`${api}/v1/customerLedger/list/${cId}`);
  },

  saveOrUpdate: (customer: Customer): Promise<any> => {
    return http.post<Customer>(`${api}/v1/customer/saveOrUpdate`, customer);
  },
};