import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const CategoryService = {
  list: () => {
    return http.get(`${apiUrl}/v1/catalog/category/list`);
  },

  deleteById: (id: any) => {
    return http.get(`${apiUrl}/v1/catalog/category/delete/id/${id}`);
  },

  saveOrUpdate: (category: any) => {
    return http.post(`${apiUrl}/v1/catalog/category/saveOrUpdate`, category);
  },
};

export default CategoryService;