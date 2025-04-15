import http from "@/lib/JwtInterceptor";
import { Transaction } from "./Transaction";


const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Replace with your API URL

export const TransactionService = {
  deleteById: (id: number): Promise<any> => {
    return http.get(`${apiUrl}/v1/payment/transaction/delete/id/${id}`);
  },

  filter: (pageNumber: number, pageSize: number, search: any): Promise<Page<Transaction>> => {
    return http.post(`${apiUrl}/v1/payment/transaction/list/${pageNumber}/${pageSize}`, search);
  },
};

// Define the Page type if not already defined
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}