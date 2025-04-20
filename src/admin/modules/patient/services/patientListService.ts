
import http from "@/lib/JwtInterceptor";
import patientMockService from "./patientMockService";

export const fetchAllPatients = async (patient:any) => {
    return await http.get(`/v1/patient/list`, patient);
};

// Add search function for patients
export const searchPatients = async (searchTerm: string) => {
  try {
    // In production environment, this would call the API
    // return await http.get(`/v1/patient/search?query=${searchTerm}`);
    
    // For development, we'll use the mock service
    return await patientMockService.searchPatients(searchTerm);
  } catch (error) {
    console.error("Error searching patients:", error);
    throw error;
  }
};

// Export as an object to match the import in QuickPatientForm
export const patientListService = {
  searchPatients
};
