import http from "@/lib/JwtInterceptor";
import { PatientSchedule } from "../types/PatientSchedule";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

class ScheduleService {

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

  saveOrUpdate(schedule: PatientSchedule) {
    return http.post(`${apiUrl}/v1/schedule/saveOrUpdate`, schedule);
  }
}

export default new ScheduleService();