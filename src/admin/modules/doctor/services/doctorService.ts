
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../types/Doctor";

export const fetchDoctorDetailsById = async (id: any) => {
  return await http.get<Doctor>(`v1/public/doctor/id/${id}`);
};
