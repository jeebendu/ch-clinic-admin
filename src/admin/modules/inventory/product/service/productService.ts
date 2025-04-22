
import { Product } from '../types/Product';
import { getEnvVariable } from '@/utils/envUtils';
import http from '@/lib/JwtInterceptor';

const apiUrl = getEnvVariable('API_URL');

// Interfaces
// export interface Product {
//   id: number;
//   name: string;
//   // Add other product properties here
// }

export interface StockConfig {
  id: number;
  name: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Service functions
export const ProductService = {
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


  list: async () => {
    try {
      const response = await http.get(`${apiUrl}/v1/catalog/product/list`);
      // console.log("Raw API response:", response);
      return response.data; // Return just the data part of the response
    } catch (error) {
      console.error("Error fetching Distributor:", error);
      throw error;
    }
  },

  getConfigAlert: () => {
    return http.get<StockConfig[]>(`${apiUrl}/v1/stockConfig/list`);
  },

  saveOrUpdate: (product: any) => {
    return http.post(`${apiUrl}/v1/catalog/product/saveOrUpdate`, product);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/catalog/product/id/${id}`);
  },

  searchByName: (searchObj: Product[]) => {
    return http.post<Product[]>(`${apiUrl}/v1/catalog/product/searchByName`, searchObj);
  },

  filterProduct: (pageNumber: number, pageSize: number, searchObj: any) => {
    return http.post<Page<any>>(`${apiUrl}/v1/catalog/product/filter/${pageNumber}/${pageSize}`, searchObj);
  },
};

export default ProductService;