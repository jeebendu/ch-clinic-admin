
import http from "@/lib/JwtInterceptor";
import { AllAppointment } from "../types/Appointment";
import { format } from "date-fns";
import { isProduction } from "@/utils/envUtils";
import { getMockAppointments, getMockAppointmentById } from "./appointmentMockService";

export interface AppointmentQueryParams {
  page: number;
  size: number;
  doctorId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: String;
  branches: Number[];
  statuses: String[];
}

/**
 * Fetches appointments by doctor ID with pagination support
 */
export const fetchAppointmentsByDoctorId = async (params: AppointmentQueryParams) => {
  if (isProduction()) {
    const { doctorId, page, size, status, fromDate, toDate, branches, statuses, searchTerm } = params;
    let url = `v1/appointments/doctor/${doctorId}?page=${page}&size=${size}`;
    
    if (status) url += `&status=${status}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    
    const filter = {
      branches: branches,
      statuses: statuses,
      searchTerm: searchTerm
    };

    return await http.post(url, filter);
  } else {
    // Generate mock data
    return getMockAppointments(params);
  }
};

/**
 * Fetches all appointments with pagination support
 */
export const fetchAllAppointments = async (params: AppointmentQueryParams) => {
  if (isProduction()) {
    const { page, size, status, fromDate, toDate } = params;
    let url = `v1/appointments?page=${page}&size=${size}`;
    
    if (status) url += `&status=${status}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;
    
    return await http.get(url);
  } else {
    // Generate mock data
    return getMockAppointments(params);
  }
};

/**
 * Updates an appointment's status
 */
export const updateAppointmentStatus = async (appointmentId: number, status: string) => {
  if (isProduction()) {
    return await http.put(`v1/appointments/${appointmentId}/status`, { status });
  } else {
    // Mock success response
    return Promise.resolve({ data: { success: true } });
  }
};

/**
 * Fetch a single appointment by ID
 */
export const getAppointmentById = async (appointmentId: string | number) => {
  if (isProduction()) {
    return await http.get(`/v1/appointments/id/${appointmentId}`);
  } else {
    // Mock data for a single appointment
    const mockAppointment = await getMockAppointmentById(appointmentId);
    return Promise.resolve({ data: mockAppointment });
  }
};
