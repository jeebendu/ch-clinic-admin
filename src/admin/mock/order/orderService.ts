import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL;

export const OrderService = {
  list: () => {
    return http.get(`${api}/v1/sales/order/list`);
  },

  deleteById: (id:number) => {
    return http.get(`${api}/v1/sales/order/delete/id/${id}`);
  },

  getById: (id:number) => {
    return http.get(`${api}/v1/sales/order/id/${id}`);
  },

  saveOrUpdate: (order:any) => {
    return http.post(`${api}/v1/sales/order/saveOrUpdate`, order);
  },

  printById: (id:number) => {
    return http.get(`${api}/v1/sales/order/print/${id}`, {
      responseType: 'arraybuffer',
    });
  },

  approveById: (id:number) => {
    return http.get(`${api}/v1/sales/order/approve/id/${id}`);
  },

  filter: (pageNumber:any, pageSize:any, search:any) => {
    return http.post(`${api}/v1/sales/order/filter/${pageNumber}/${pageSize}`, search);
  },
};