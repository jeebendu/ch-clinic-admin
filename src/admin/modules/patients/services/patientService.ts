
import { Patient } from '../types/Patient';
import { AxiosResponse } from 'axios';
import http from "@/lib/JwtInterceptor";

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
  return await http.post(`/v1/appointments/patients/doctor/1`, params);
};

export const fetchPatientById = async (id: number): Promise<AxiosResponse<Patient>> => {
  return await http.get(`/v1/patient/id/${id}`);
};

export const fetchAllPatients = async (patient: any) => {
  return await http.get(`/v1/patient/list`, patient);
};
