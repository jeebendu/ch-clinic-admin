import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

export const SalesOrderService = {
    list: () => {
        return http.get(`${apiUrl}/v1/sales/order/list`);
      },
    
      deleteById: (id: number) => {
        return http.get(`${apiUrl}/v1/sales/order/delete/id/${id}`);
      },
    
      getById: (id: number) => {
        return http.get(`${apiUrl}/v1/sales/order/id/${id}`);
      },
    
      saveOrUpdate: (order: any) => {
        return http.post(`${apiUrl}/v1/sales/order/saveOrUpdate`, order);
      },
    
      printById: (id: number) => {
        return http.get(`${apiUrl}/v1/sales/order/print/${id}`, {
          responseType: 'arraybuffer',
        });
      },
    
      approveById: (id: number) => {
        return http.get(`${apiUrl}/v1/sales/order/approve/id/${id}`);
      },
    
      filter: (pageNumber: number, pageSize: number, search: any) => {
        return http.post(
          `${apiUrl}/v1/sales/order/filter/${pageNumber}/${pageSize}`,
          search
        );
      },
};

export default SalesOrderService;