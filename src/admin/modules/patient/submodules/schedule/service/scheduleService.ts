import http from "@/lib/JwtInterceptor";


const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface Schedule {
  id: number;
  name: string;
  // Add other properties of the Schedule interface as needed
}

class ScheduleService {
  list() {
    return http.get(`${api}/v1/schedule/list`);
  }

  deleteById(id: number) {
    return http.get(`${api}/v1/schedule/delete/id/${id}`);
  }

  listByPID(id: number) {
    return http.get(`${api}/v1/schedule/list/PID/${id}`);
  }

  getById(id: number) {
    return http.get(`${api}/v1/schedule/id/${id}`);
  }

  saveOrUpdate(schedule: Schedule) {
    return http.post(`${api}/v1/schedule/saveOrUpdate`, schedule);
  }
}

export default new ScheduleService();