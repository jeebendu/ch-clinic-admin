import http from "@/lib/JwtInterceptor";


const WeeklyScheduleService = {
  getByDoctorAndBranch: async (doctorId: number, branchId: number) => {
    try {
      return http.get(`/v1/doctor/weekly-schedule/branch/${branchId}/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error fetching doctor breaks:", error);
      throw error;
    }
  }
};

export default WeeklyScheduleService;
