
import http from "@/lib/JwtInterceptor";
import { Clinic } from "../../types/Clinic";
import { isDemoMode } from "@/utils/envUtils";
import ClinicMockService from "./clinicMockService";
import { ClinicStatus } from "../../types/ClinicStatus";

const apiUrl = import.meta.env.VITE_BASE_URL;

const ClinicService = {
  getPublicInfo: (clinicId: string): Promise<Clinic> => {
    if (isDemoMode()) {
      return ClinicMockService.getPublicInfo(clinicId);
    }
    return http.get(`${apiUrl}/clinics/public/info/${clinicId}`).then(response => response.data);
  },
  
  list: (): Promise<Clinic[]> => {
    if (isDemoMode()) {
      return ClinicMockService.list();
    }
    
    try {
      return http.get(`${apiUrl}/v1/clinic/list`).then(response => response.data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      return Promise.reject(error);
    }
  },

  getById: (id: number): Promise<Clinic> => {
    if (isDemoMode()) {
      return ClinicMockService.getById(id);
    }
    return http.get(`${apiUrl}/v1/clinic/id/${id}`).then(response => response.data);
  },

  saveOrUpdate:async (clinic: Partial<Clinic>) => {
    // if (isDemoMode()) {
    //   return ClinicMockService.saveOrUpdate(clinic);
    // }
    
    return http.post(`${apiUrl}/v1/clinic/saveOrUpdate`, clinic).then(response => response.data);
  },

  deleteById: (id: number): Promise<void> => {
    if (isDemoMode()) {
      return ClinicMockService.deleteById(id);
    }
    return http.delete(`${apiUrl}/v1/clinic/delete/id/${id}`).then(response => response.data);
  },

  updateStatus: (id: number, active: boolean): Promise<Clinic> => {
    if (isDemoMode()) {
      return ClinicMockService.updateStatus(id, active);
    }
    return http.put(`${apiUrl}/v1/clinic/status/${id}/${active ? 'activate' : 'deactivate'}`, {}).then(response => response.data);
  },

  // New methods for clinic status
  getClinicStatus: (id: number): Promise<ClinicStatus> => {
    if (isDemoMode()) {
      return ClinicMockService.getClinicStatus ? 
        ClinicMockService.getClinicStatus(id) : 
        Promise.resolve({
          databaseStatus: 'created' as const,
          schemaVersion: '1.0.0',
          userCreationStatus: 'created' as const,
          lastPasswordResetSent: new Date().toISOString()
        });
    }
    return http.get(`${apiUrl}/v1/clinic/status/${id}`).then(response => response.data);
  },

  resendPasswordEmail: (clinicId: number, userId: number): Promise<void> => {
    if (isDemoMode()) {
      return ClinicMockService.resendPasswordEmail ? 
        ClinicMockService.resendPasswordEmail(clinicId, userId) : 
        Promise.resolve();
    }
    return http.post(`${apiUrl}/v1/clinic/${clinicId}/users/${userId}/resend-password`).then(response => response.data);
  },

  updateUserContact: (clinicId: number, userId: number, data: {email?: string, phone?: string}): Promise<any> => {
    if (isDemoMode()) {
      return ClinicMockService.updateUserContact ? 
        ClinicMockService.updateUserContact(clinicId, userId, { email: data.email || '', phone: data.phone || '' }) : 
        Promise.resolve({});
    }
    return http.put(`${apiUrl}/v1/clinic/${clinicId}/users/${userId}/contact`, data).then(response => response.data);
  }
};

export default ClinicService;
