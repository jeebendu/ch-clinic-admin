
import http from "@/lib/JwtInterceptor";

export interface TestCategory {
  id: number;
  name: string;
  description: string;
  active: boolean;
  testTypes?: TestType[];
}

export interface TestType {
  id: number;
  name: string;
  description: string;
  active: boolean;
  categoryId: number;
  categoryName?: string;
  parameters?: TestParameter[];
}

export interface TestParameter {
  id: number;
  name: string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  referenceText?: string;
  active: boolean;
  testTypeId: number;
  testTypeName?: string;
}

export interface TestResult {
  id?: number;
  testReportId?: number;
  testParameter: TestParameter;
  resultValue?: number;
  resultText?: string;
  unitOverride?: string;
  notes?: string;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW' | 'ABNORMAL';
}

export interface TestReport {
  id?: number;
  reportNumber?: string;
  patient: { id: number };
  testType: { id: number };
  reportDate?: string;
  diagnosis?: string;
  comments?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'CANCELLED';
  results?: TestResult[];
}

export const laboratoryService = {
  // Test Categories
  getAllCategories: async (): Promise<TestCategory[]> => {
    const response = await http.get('/v1/laboratory/categories/list');
    return response.data;
  },

  getActiveCategoriesWithTypes: async (): Promise<TestCategory[]> => {
    const response = await http.get('/v1/laboratory/categories/list/active-with-types');
    return response.data;
  },

  // Test Types
  getTestTypesByCategory: async (categoryId: number): Promise<TestType[]> => {
    const response = await http.get(`/v1/laboratory/categories/${categoryId}/test-types`);
    return response.data;
  },

  getTestTypeWithParameters: async (testTypeId: number): Promise<TestType> => {
    const response = await http.get(`/v1/laboratory/categories/test-types/id/${testTypeId}/with-parameters`);
    return response.data;
  },

  // Test Reports
  generateReportNumber: async (): Promise<string> => {
    const response = await http.get('/v1/laboratory/reports/generate-report-number');
    return response.data;
  },

  saveReport: async (report: TestReport) => {
    const response = await http.post('/v1/laboratory/reports/saveOrUpdate', report);
    return response.data;
  },

  getReportsByPatientId: async (patientId: number): Promise<TestReport[]> => {
    const response = await http.get(`/v1/laboratory/reports/patient/${patientId}`);
    return response.data;
  },

  getReportById: async (reportId: number): Promise<TestReport> => {
    const response = await http.get(`/v1/laboratory/reports/id/${reportId}/with-results`);
    return response.data;
  },

  downloadReportPdf: async (reportId: number): Promise<Blob> => {
    const response = await http.get(`/v1/laboratory/reports/download/pdf/id/${reportId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  sendReportByEmail: async (reportId: number, toEmail: string, subject: string) => {
    const response = await http.post(`/v1/laboratory/reports/send-email/id/${reportId}`, {
      toEmail,
      subject
    });
    return response.data;
  }
};
