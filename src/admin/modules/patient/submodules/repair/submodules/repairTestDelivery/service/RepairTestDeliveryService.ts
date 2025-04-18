import http from "@/lib/JwtInterceptor";
import { RepairTestDelivery } from "../types/RepairTestDelivery";


const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class RepairTestDeliveryService {
  list() {
    return http.get<any>(`${api}/v1/repairTestDelivery/list`);
  }

  deleteById(id: number) {
    return http.get<any>(`${api}/v1/repairTestDelivery/delete/id/${id}`);
  }

  getById(id: number) {
    return http.get<any>(`${api}/v1/repairTestDelivery/id/${id}`);
  }

  getByRId(id: number) {
    return http.get<any>(`${api}/v1/repairTestDelivery/repairId/${id}`);
  }

  saveOrUpdate(repairTestDelivery: RepairTestDelivery) {
    return http.post<any>(`${api}/v1/repairTestDelivery/saveOrUpdate`, repairTestDelivery);
  }
}

export default new RepairTestDeliveryService();