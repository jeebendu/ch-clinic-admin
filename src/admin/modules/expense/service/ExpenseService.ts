
import http from "@/lib/JwtInterceptor";
import { Expense } from "../types/Expense";

const ExpenseService = {
  getExpenses: async () => {
    const response = await http.get<Expense[]>('/api/expenses');
    return response.data;
  },
  
  getExpenseById: async (id: number) => {
    const response = await http.get<Expense>(`/api/expenses/${id}`);
    return response.data;
  },
  
  createExpense: async (expense: Omit<Expense, 'id'>) => {
    const response = await http.post<Expense>('/api/expenses', expense);
    return response.data;
  },
  
  updateExpense: async (id: number, expense: Partial<Expense>) => {
    const response = await http.put<Expense>(`/api/expenses/${id}`, expense);
    return response.data;
  },
  
  deleteExpense: async (id: number) => {
    await http.delete(`/api/expenses/${id}`);
  }
};

export default ExpenseService;
