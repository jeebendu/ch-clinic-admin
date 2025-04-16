
import http from '@/lib/JwtInterceptor';
import { Slider } from './slider';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const SliderService = {
  list: (): Promise<any> => {
    return http.get(`${api}/v1/slider/list`);
  },

  deleteById: (id: number): Promise<any> => {
    return http.get(`${api}/v1/slider/delete/id/${id}`);
  },

  filter: (pageNumber: number, pageSize: number, filter: any): Promise<any> => {
    return http.post(`${api}/v1/slider/filter/${pageNumber}/${pageSize}`, filter);
  },

  saveOrUpdate: (slider: Slider): Promise<any> => {
    return http.post(`${api}/v1/slider/saveOrUpdate`, slider);
  },

  upload: (formData: FormData): Promise<any> => {
    const headers = { Accept: 'application/json' };
    return http.post(`${api}/v1/slider/upload`, formData, { headers });
  },

  getById: (id: number): Promise<any> => {
    return http.get(`${api}/v1/slider/id/${id}`);
  },

  getStatus: (): { id: string; name: string }[] => {
    return [
      { id: '0', name: 'Active' },
      { id: '1', name: 'Inactive' },
    ];
  },
};