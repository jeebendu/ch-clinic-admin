
import http from "@/lib/JwtInterceptor";
import { ShipmentType } from "../submodules/repairCourier/types/RepairCourier";
import { Repair, RepairProblemData } from "../types/Repair";
import { RepairStatus } from "../../../types/PatientRepair";


const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class RepairService {
  list() {
    return http.get<Repair[]>(`${api}/v1/repair/list`);
  }

  problemDatalist() {
    return http.get<RepairProblemData[]>(`${api}/v1/Repair/RepairProblemData/list`);
  }

  deleteById(id: number) {
    return http.get<any>(`${api}/v1/repair/delete/id/${id}`);
  }

  getById(id: number) {
    return http.get<Repair>(`${api}/v1/repair/id/${id}`);
  }

  saveOrUpdate(repair: Repair) {
    return http.post<any>(`${api}/v1/repair/saveOrUpdate`, repair);
  }

  printById(id: number) {
    return http.get<any>(`${api}/v1/repair/print/id/${id}`, { responseType: 'arraybuffer' });
  }

  getRepairStatusList() {
    return http.get<RepairStatus[]>(`${api}/v1/repair/statusList`);
  }

  getAddresstypeList() {
    return http.get<ShipmentType[]>(`${api}/v1/repair/addresstype/list`);
  }

  deleteRepairCourier(id: number) {
    return http.get<any>(`${api}/v1/repair/couriers/delete/id/${id}`);
  }
}

export default new RepairService();