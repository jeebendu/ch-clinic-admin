
import http from "@/lib/JwtInterceptor";
import { PatientReport } from "../types/PatientReport";

export interface CreateReportRequest {
  patientId: string;
  visitId?: string;
  reportType: string;
}

export const patientReportService = {
  // Get all reports for a visit
  getReportsByVisitId: async (visitId: string): Promise<PatientReport[]> => {
    try {
      const response = await http.get(`/v1/patient-reports/visit/${visitId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports by visit ID:', error);
      return [];
    }
  },

  // Get all reports for a patient
  getReportsByPatientId: async (patientId: string): Promise<PatientReport[]> => {
    try {
      const response = await http.get(`/v1/patient-reports/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports by patient ID:', error);
      return [];
    }
  },

  // Get a specific report by ID
  getReportById: async (reportId: string): Promise<PatientReport | null> => {
    try {
      const response = await http.get(`/v1/patient-reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report by ID:', error);
      return null;
    }
  },

  // Create a new report
  createReport: async (reportData: CreateReportRequest) => {
    try {
      const response = await http.post('/v1/patient-reports/create', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Delete a report
  deleteReport: async (reportId: string) => {
    try {
      const response = await http.delete(`/v1/patient-reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
};
