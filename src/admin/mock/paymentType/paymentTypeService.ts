import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const PaymentTypeService = {
  list: () => {
    return http.get(`${apiUrl}/v1/payment/type/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/payment/type/delete/id/${id}`);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/payment/type/id/${id}`);
  },

  saveOrUpdate: (paymentTransaction: any) => {
    return http.post(`${apiUrl}/v1/payment/type/saveOrUpdate`, paymentTransaction);
  },
};

export default PaymentTypeService;