import http from "@/lib/JwtInterceptor";
import { DoctorLeave } from "../types/DoctorAvailability";
import { Doctor } from "@/admin/modules/doctor/types/Doctor";


export const leaveService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number)=> {
    try {
      return http.get(`/v1/doctor-leave/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor leaves:", error);
      throw error;
    }
  },

    getAllByDoctorBranchId: async (drBranchId: number)=> {
    try {
      return http.get(`/v1/doctor-leave/doctor-branch/${drBranchId}`);
    } catch (error) {
      console.error("Error fetching doctor leaves:", error);
      throw error;
    }
  },

  
  saveLeave: async (leave: DoctorLeave) => {
    try {
      return http.post("/v1/doctor-leave/saveOrUpdate", leave)
    } catch (error) {
      console.error("Error saving doctor leave:", error);
      throw error;
    }
  },

  deleteLeave: async (id: number) => {
    try {
      return http.delete(`/v1/doctor-leave/delete/id/${id}`);
    } catch (error) {
      console.error("Error deleting doctor leave:", error);
      throw error;
    }
  }
};
