
import { Patient } from '../types/Patient';
import { AxiosResponse } from 'axios';
import http from "@/lib/JwtInterceptor";
import patientMockService from './patientMockService';

export interface PatientQueryParams {
  page: number;
  size: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  gender?: string[];
  ageGroup?: string[];
  lastVisit?: string[];
  insuranceProvider?: string[];
}

export interface PatientResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const fetchPatients = async (params: PatientQueryParams): Promise<AxiosResponse<PatientResponse>> => {
  // Use mock service instead of actual API call for now
  const response = await patientMockService.getPatients(params.page, params.size);
  return {
    data: response,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { headers: {} } as any
  };
};

export const fetchPatientById = async (id: number): Promise<AxiosResponse<Patient>> => {
  // Use mock service instead of actual API call for now
  const patient = await patientMockService.getMockPatientById(id);
  return {
    data: patient,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { headers: {} } as any
  };
};

export const fetchAllPatients = async (patient: any) => {
  return await http.get(`/v1/patient/list`, patient);
};
