import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";


const apiUrl = getEnvVariable('API_URL');

export const PurchaseOrderService = {
  list: () => {
    return http.get(`${apiUrl}/v1/purchase/order/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/purchase/order/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/purchase/order/id/${id}`);
  },

  saveOrUpdate: (order: any) => {
    return http.post(`${apiUrl}/v1/purchase/order/saveOrUpdate`, order);
  },

  printById: (id: number) => {
    return http.get(`${apiUrl}/v1/purchase/order/print/${id}`, {
      responseType: 'arraybuffer',
    });
  },

  approveById: (id: number) => {
    return http.get(`${apiUrl}/v1/purchase/order/approve/id/${id}`);
  },

  dataImport: (formData: FormData) => {
    return http.post(`${apiUrl}/v1/purchase/order/import`, formData, {
      headers: {
        Accept: 'application/json',
      },
    });
  },

  filter: (pageNumber: number, pageSize: number, search: any) => {
    return http.post(
      `${apiUrl}/v1/purchase/order/filter/${pageNumber}/${pageSize}`,
      search
    );
  },
};

export default PurchaseOrderService;