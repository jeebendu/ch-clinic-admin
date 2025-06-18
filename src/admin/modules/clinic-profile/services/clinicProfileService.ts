
import http from "@/lib/JwtInterceptor";
import { ClinicProfile } from "../types/ClinicProfile";
import { isDemoMode } from "@/utils/envUtils";
import ClinicProfileMockService from "./clinicProfileMockService";

const apiUrl = import.meta.env.VITE_BASE_URL;

const ClinicProfileService = {
  getProfile: (): Promise<ClinicProfile> => {
    if (isDemoMode()) {
      return ClinicProfileMockService.getProfile();
    }
    return http.get(`${apiUrl}/clinic/profile`).then(response => response.data);
  },

  updateProfile: (profile: Partial<ClinicProfile>): Promise<ClinicProfile> => {
    if (isDemoMode()) {
      return ClinicProfileMockService.updateProfile(profile);
    }
    return http.put(`${apiUrl}/clinic/profile`, profile).then(response => response.data);
  },

  uploadLogo: (file: File): Promise<string> => {
    if (isDemoMode()) {
      return ClinicProfileMockService.uploadLogo(file);
    }
    const formData = new FormData();
    formData.append('file', file);
    return http.post(`${apiUrl}/clinic/profile/upload/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data.url);
  },

  uploadBanner: (file: File): Promise<string> => {
    if (isDemoMode()) {
      return ClinicProfileMockService.uploadBanner(file);
    }
    const formData = new FormData();
    formData.append('file', file);
    return http.post(`${apiUrl}/clinic/profile/upload/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data.url);
  },

  uploadFavicon: (file: File): Promise<string> => {
    if (isDemoMode()) {
      return ClinicProfileMockService.uploadFavicon(file);
    }
    const formData = new FormData();
    formData.append('file', file);
    return http.post(`${apiUrl}/clinic/profile/upload/favicon`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data.url);
  }
};

export default ClinicProfileService;
