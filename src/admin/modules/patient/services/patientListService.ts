
import http from "@/lib/JwtInterceptor";

export const fetchAllPatients = async (patient: any) => {
    return await http.get(`/v1/patient/list`, patient);
};

// Add search function for patients
export const searchPatients = async (searchTerm: string) => {
  try {
    return await http.get(`/v1/patient/search?query=${searchTerm}`);
  } catch (error) {
    console.error("Error searching patients:", error);
    throw error;
  }
};

// Export as an object to match the import in QuickPatientForm
export const patientListService = {
  searchPatients
};
