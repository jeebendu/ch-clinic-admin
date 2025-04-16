import http from "@/lib/JwtInterceptor";
import { Sequence } from "../types/sequence";

const apiUrl = process.env.REACT_APP_API_URL;

const SequenceService = {
  deleteById: (id: number) => {
    return http.get(`${apiUrl}/v1/sequence/delete/id/${id}`);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/sequence/list`);
  },

  saveOrUpdate: (sequence: Sequence) => {
    return http.post(`${apiUrl}/v1/sequence/saveOrUpdate`, sequence);
  },

  getById: (id: number) => {
    return http.get(`${apiUrl}/v1/sequence/id/${id}`);
  },
};

export default SequenceService;