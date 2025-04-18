import http from "@/lib/JwtInterceptor";
import { RepairPayment } from "../types/RepairPayment";


const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class RepairPaymentService {
  printByRepairId(repairId: number, payId: number) {
    return http.get(`${api}/v1/repair/print/payment/${repairId}/pay/${payId}`, {
      responseType: 'arraybuffer',
    });
  }

  getById(id: number) {
    return http.get<RepairPayment[]>(`${api}/v1/repair/payments/${id}`);
  }

  saveOrUpdate(payment: RepairPayment) {
    return http.post(`${api}/v1/repair/saveOrUpdate/repairPayment`, payment);
  }

  delete(id: number) {
    return http.get(`${api}/v1/repair/payment/delete/id/${id}`);
  }
}

export default new RepairPaymentService();