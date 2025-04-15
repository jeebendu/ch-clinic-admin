
import http from "@/lib/JwtInterceptor";

export interface Clinic {
  id: number;
  uid: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan?: any;
}

export const fetchClinics = async () => {
  return await http.get('/v1/clinics');
};
