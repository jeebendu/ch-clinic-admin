import http from "@/lib/JwtInterceptor";

export const fetchAllPatients = async (patient:any) => {
    return await http.get(`/v1/patient/list`, patient);
  };