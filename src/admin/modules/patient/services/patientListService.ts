
import http from "@/lib/JwtInterceptor";
import patientMockService from "./patientMockService";
import { Patient } from "../types/Patient";
import { PaginatedResponse } from "@/types/common";

export const fetchAllPatients = async (patient:any) => {
    return await http.get(`/v1/patient/list`, patient);
};

// Add search function for patients
export const searchPatients = async (searchTerm: string): Promise<Patient[]> => {
  try {
    // In production environment, this would call the API
    // return await http.get(`/v1/patient/search?query=${searchTerm}`);
    
    // For development, we'll use the mock service
    const response = await patientMockService.fetchPaginated(0, 20, { value: searchTerm, status: null });
    return response.content;
  } catch (error) {
    console.error("Error searching patients:", error);
    throw error;
  }
};

// Export as an object to match the import in QuickPatientForm
export const patientListService = {
  searchPatients
};
