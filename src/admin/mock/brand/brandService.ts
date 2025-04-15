import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const BrandService = {
  list: () => {
    return http.get(`${apiUrl}/v1/catalog/brand/list`);
  },

  deleteById: (id: any) => {
    return http.get(`${apiUrl}/v1/catalog/brand/delete/id/${id}`);
  },

  paginatedList: (pageNumber: number, pageSize: number, search: any) => {
    const url = `${apiUrl}/v1/catalog/brand/list/${pageNumber}/${pageSize}${search ? '/' + search : ''}`;
    return http.get(url);
  },

  saveOrUpdate: (brand: any) => {
    return http.post(`${apiUrl}/v1/catalog/brand/saveOrUpdate`, brand);
  },

  filter: (pageNumber: number, pageSize: number, search: any) => {
    const url = `${apiUrl}/v1/catalog/brand/filter/${pageNumber}/${pageSize}`;
    return http.post(url, search);
  },
};

export default BrandService;