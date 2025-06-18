
import http from "@/lib/JwtInterceptor";
import { ClinicRequest } from "../../types/ClinicRequest";
import { isDemoMode } from "@/utils/envUtils";
import ClinicRequestMockService from "./clinicRequestMockService";

const apiUrl = import.meta.env.VITE_BASE_URL;

// This service handles clinic requests/inquiries
const ClinicRequestService = {
  list: (): Promise<ClinicRequest[]> => {
    if (isDemoMode()) {
      return ClinicRequestMockService.list();
    }
    
    try {
      return http.get(`${apiUrl}/tenants/list`).then(response => response.data);
    } catch (error) {
      console.error("Error fetching clinic requests:", error);
      return Promise.reject(error);
    }
  },

  getById: (id: number): Promise<ClinicRequest> => {
    if (isDemoMode()) {
      return ClinicRequestMockService.getById(id);
    }
    return http.get(`${apiUrl}/tenants/requests/${id}`).then(response => response.data);
  },

  saveOrUpdate: (clinicRequest: Partial<ClinicRequest>): Promise<ClinicRequest> => {
    if (isDemoMode()) {
      return ClinicRequestMockService.saveOrUpdate(clinicRequest);
    }
    
    if (clinicRequest.id) {
      return http.put(`${apiUrl}/tenants/requests/${clinicRequest.id}`, clinicRequest).then(response => response.data);
    }
    return http.post(`${apiUrl}/tenants/requests`, clinicRequest).then(response => response.data);
  },

  approve: (id: number): Promise<ClinicRequest> => {
    if (isDemoMode()) {
      return ClinicRequestMockService.approve(id);
    }
    return http.get(`${apiUrl}/tenants/approve/${id}`).then(response => response.data);
  },

  reject: (id: number): Promise<ClinicRequest> => {
    if (isDemoMode()) {
      return ClinicRequestMockService.reject(id);
    }
    return http.put(`${apiUrl}/tenants/requests/${id}/reject`).then(response => response.data);
  },

  deleteById: (id: number): Promise<void> => {
    if (isDemoMode()) {
      return ClinicRequestMockService.deleteById(id);
    }
    return http.delete(`${apiUrl}/tenants/requests/${id}`).then(response => response.data);
  }
};

export default ClinicRequestService;
