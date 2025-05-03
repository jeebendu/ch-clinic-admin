
import http from "@/lib/JwtInterceptor";
import { Doctor } from "../../doctor/types/Doctor";

export const fetchDoctorDetailsById = async (id: any) => {
  try {
    const response = await http.get<{status: boolean, message: string, response: Doctor}>(`v1/public/doctor/id/${id}`);
    return response.data.response;
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    throw error;
  }
};
