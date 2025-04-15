import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const ProductTypeService = {
  list: () => {
    return http.get(`${apiUrl}/v1/catalog/type/list`);
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/catalog/type/delete/id/${id}`);
  },

  saveOrUpdate: (productType: any) => {
    return http.post(`${apiUrl}/v1/catalog/type/saveOrUpdate`, productType);
  },
};

export default ProductTypeService;