import http from "@/lib/JwtInterceptor";
import { Config } from "../types/config";

const apiUrl = process.env.REACT_APP_API_URL;

const ConfigService = {
  save: (config: Config) => {
    return http.post(`${apiUrl}/v1/catalog/config/save`, config);
  },

  list: () => {
    return http.get(`${apiUrl}/v1/catalog/config/all`);
  },
};

export default ConfigService;