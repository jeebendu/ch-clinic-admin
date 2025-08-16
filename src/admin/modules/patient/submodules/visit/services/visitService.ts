import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";
import { Visit } from "../types/Visit";
const apiUrl = getEnvVariable('API_URL');

class VisitService {

  list() {
    return http.get(`${apiUrl}/v1/schedule/list`);
  }

  deleteById(id: number) {
    return http.get(`${apiUrl}/v1/schedule/delete/id/${id}`);
  }

  listByPID(id: number) {
    return http.get(`${apiUrl}/v1/schedule/list/PID/${id}`);
  }

  getById(id: number) {
    return http.get(`${apiUrl}/v1/schedule/id/${id}`);
  }

  saveOrUpdate(schedule: Visit) {
    return http.post(`${apiUrl}/v1/schedule/saveOrUpdate`, schedule);
  }

}

export default new VisitService();
