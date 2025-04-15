import { Sequence } from '@/admin/types/newModel/Sequence';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const SequenceService = {
  deleteById: (id: number) => {
    return axios.get(`${apiUrl}/v1/sequence/delete/id/${id}`);
  },

  list: () => {
    return axios.get(`${apiUrl}/v1/sequence/list`);
  },

  saveOrUpdate: (sequence: Sequence) => {
    return axios.post(`${apiUrl}/v1/sequence/saveOrUpdate`, sequence);
  },

  getById: (id: number) => {
    return axios.get(`${apiUrl}/v1/sequence/id/${id}`);
  },
};