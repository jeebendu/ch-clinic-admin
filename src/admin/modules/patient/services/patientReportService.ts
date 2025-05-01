
import http from "@/lib/JwtInterceptor";
import { getEnvVariable } from "@/utils/envUtils";

const apiUrl = getEnvVariable('API_URL');

const PatientReportService = {
  getReportById: async (id: number) => {
    try {
      const response = await http.get(`${apiUrl}/v1/patient/report/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient report with ID ${id}:`, error);
      throw error;
    }
  },

  createReport: async (reportData: any) => {
    try {
      const response = await http.post(`${apiUrl}/v1/patient/report/create`, reportData);
      return response.data;
    } catch (error) {
      console.error("Error creating patient report:", error);
      throw error;
    }
  },

  updateReport: async (reportData: any) => {
    try {
      const response = await http.put(`${apiUrl}/v1/patient/report/update`, reportData);
      return response.data;
    } catch (error) {
      console.error("Error updating patient report:", error);
      throw error;
    }
  },

  // Mock implementation for development
  mockGetReportById: async (id: number) => {
    return {
      id: id,
      type: "audiometry",
      patientId: 1,
      data: {
        rightEar: {
          airConduction: [
            { frequency: 250, threshold: 30 },
            { frequency: 500, threshold: 35 },
            { frequency: 1000, threshold: 40 },
            { frequency: 2000, threshold: 45 },
            { frequency: 4000, threshold: 50 },
            { frequency: 8000, threshold: 55 }
          ],
          boneConduction: [
            { frequency: 250, threshold: 25 },
            { frequency: 500, threshold: 30 },
            { frequency: 1000, threshold: 35 },
            { frequency: 2000, threshold: 40 },
            { frequency: 4000, threshold: 45 }
          ]
        },
        leftEar: {
          airConduction: [
            { frequency: 250, threshold: 20 },
            { frequency: 500, threshold: 25 },
            { frequency: 1000, threshold: 30 },
            { frequency: 2000, threshold: 35 },
            { frequency: 4000, threshold: 40 },
            { frequency: 8000, threshold: 45 }
          ],
          boneConduction: [
            { frequency: 250, threshold: 15 },
            { frequency: 500, threshold: 20 },
            { frequency: 1000, threshold: 25 },
            { frequency: 2000, threshold: 30 },
            { frequency: 4000, threshold: 35 }
          ]
        }
      },
      createdAt: "2023-06-15T10:30:00Z"
    };
  }
};

export default PatientReportService;
