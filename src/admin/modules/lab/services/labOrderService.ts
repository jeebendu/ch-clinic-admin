
import http from "@/lib/JwtInterceptor";
import { LabOrder, LabOrderFormData, TestCategory, TestType } from "../types/LabOrder";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const labOrderService = {
  // Lab Orders
  createLabOrder: async (orderData: LabOrderFormData): Promise<LabOrder> => {
    const response = await http.post(`${apiUrl}/v1/lab-orders/create`, orderData);
    return response.data;
  },

  getLabOrders: async (page = 0, size = 20, filters?: any): Promise<any> => {
    const response = await http.post(`${apiUrl}/v1/lab-orders/list/${page}/${size}`, filters || {});
    return response.data;
  },

  getLabOrderById: async (id: number): Promise<LabOrder> => {
    const response = await http.get(`${apiUrl}/v1/lab-orders/id/${id}`);
    return response.data;
  },

  updateLabOrder: async (id: number, orderData: Partial<LabOrder>): Promise<LabOrder> => {
    const response = await http.put(`${apiUrl}/v1/lab-orders/id/${id}`, orderData);
    return response.data;
  },

  deleteLabOrder: async (id: number): Promise<void> => {
    await http.delete(`${apiUrl}/v1/lab-orders/id/${id}`);
  },

  getLabOrdersByPatient: async (patientId: number): Promise<LabOrder[]> => {
    const response = await http.get(`${apiUrl}/v1/lab-orders/patient/${patientId}`);
    return response.data;
  },

  getLabOrdersByBranch: async (branchId: number, page = 0, size = 20): Promise<any> => {
    const response = await http.get(`${apiUrl}/v1/lab-orders/branch/${branchId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Test Categories and Types
  getTestCategories: async (): Promise<TestCategory[]> => {
    const response = await http.get(`${apiUrl}/v1/test-categories/list`);
    return response.data;
  },

  getTestTypesByCategory: async (categoryId: number): Promise<TestType[]> => {
    const response = await http.get(`${apiUrl}/v1/test-types/category/${categoryId}`);
    return response.data;
  },

  getAllTestTypes: async (): Promise<TestType[]> => {
    const response = await http.get(`${apiUrl}/v1/test-types/list`);
    return response.data;
  },

  generateOrderNumber: async (): Promise<string> => {
    const response = await http.get(`${apiUrl}/v1/lab-orders/generate-order-number`);
    return response.data;
  }
};
