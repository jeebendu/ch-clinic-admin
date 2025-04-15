import http from "@/lib/JwtInterceptor";

const apiUrl = process.env.REACT_APP_API_URL;

const ProductService = {
  getAvailability: () => {
    return [
      { id: '1', name: 'Available' },
      { id: '2', name: 'Out of Stock' },
      { id: '3', name: 'Low Stock' },
    ];
  },

  getExpiry: () => {
    return [
      { id: '0', name: 'This Month' },
      { id: '1', name: '1 Month' },
      { id: '2', name: '2 Month' },
      { id: '3', name: '3 Month' },
      { id: '4', name: '4 Month' },
      { id: '5', name: '5 Month' },
      { id: '6', name: '6 Month' },
      { id: '7', name: '7 Month' },
      { id: '8', name: '8 Month' },
      { id: '9', name: '9 Month' },
      { id: '10', name: '10 Month' },
    ];
  },

  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/catalog/product/delete/id/${id}`);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/catalog/product/list`);
  },

  getConfigAlert: () => {
    return http.get(`${apiUrl}/v1/stockConfig/list`);
  },

  saveOrUpdate: (product: any) => {
    return http.post(`${apiUrl}/v1/catalog/product/saveOrUpdate`, product);
  },

  getById: (id: any) => {
    return http.get(`${apiUrl}/v1/catalog/product/id/${id}`);
  },

  searchByName: (searchObj: any) => {
    return http.post(`${apiUrl}/v1/catalog/product/searchByName`, searchObj);
  },

  filterProduct: (pageNumber: number, pageSize: number, searchObj: any) => {
    return http.post(`${apiUrl}/v1/catalog/product/filter/${pageNumber}/${pageSize}`, searchObj);
  },
};

export default ProductService;