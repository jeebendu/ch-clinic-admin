
import http from "@/lib/JwtInterceptor";
import { Clinic } from "../../types/Clinic";
// import { isDemoMode } from "@/utils/envUtils";
import ClinicMockService from "./clinicMockService";
import { ClinicStatus } from "../../types/ClinicStatus";
import uploadHttp from "@/lib/uploadHttp";

const apiUrl = import.meta.env.VITE_BASE_URL;

const ClinicService = {
  getPublicInfo: (clinicId: string): Promise<Clinic> => {

    return http.get(`${apiUrl}/clinics/public/info/${clinicId}`).then(response => response.data);
  },
  
  list: (): Promise<Clinic[]> => {
    
    try {
      return http.get(`${apiUrl}/v1/clinic/list`).then(response => response.data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      return Promise.reject(error);
    }
  },

  getById: (id: number): Promise<Clinic> => {

    return http.get(`${apiUrl}/v1/clinic/id/${id}`).then(response => response.data);
  },

  saveOrUpdate:async (clinic: FormData) => {
    return uploadHttp.post(`${apiUrl}/v1/clinic/saveOrUpdate`, clinic).then(response => response.data);
  },

  deleteById: (id: number): Promise<void> => {

    return http.delete(`${apiUrl}/v1/clinic/delete/id/${id}`).then(response => response.data);
  },

  updateStatus: (id: number, active: boolean): Promise<Clinic> => {

    return http.put(`${apiUrl}/v1/clinic/status/${id}/${active ? 'activate' : 'deactivate'}`, {}).then(response => response.data);
  },

  // New methods for clinic status
  getClinicStatus: (id: number): Promise<ClinicStatus> => {
    return http.get(`${apiUrl}/v1/clinic/status/${id}`).then(response => response.data);
  },

  resendPasswordEmail: (clinicId: number, userId: number): Promise<void> => {

    return http.post(`${apiUrl}/v1/clinic/${clinicId}/users/${userId}/resend-password`).then(response => response.data);
  },

  updateUserContact: (clinicId: number, userId: number, data: {email?: string, phone?: string}): Promise<any> => {

    return http.put(`${apiUrl}/v1/clinic/${clinicId}/users/${userId}/contact`, data).then(response => response.data);
  }
};

export default ClinicService;
