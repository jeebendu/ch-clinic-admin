import http from "@/lib/JwtInterceptor";
import { isProduction } from "@/utils/envUtils";
import { AppointmentQueryParams } from "../types/Appointment";
import appointmentMockService from "./appointmentMockService";

/**
 * Fetches appointments by doctor ID with pagination support
 */
export const fetchAppointmentsByDoctorId = async (params: AppointmentQueryParams) => {
  const { doctorId, page, size, status, fromDate, toDate, branches, statuses, searchTerm } = params;

  if (isProduction()) {
    let url = `v1/appointments/doctor/${doctorId}?page=${page}&size=${size}`;

    if (status) url += `&status=${status}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;

    const filter = {
      branches,
      statuses,
      searchTerm,
    };

    return await http.post(url, filter);
  } else {
    // Generate mock data
    return appointmentMockService.getMockAppointments(params);
  }
};

/**
 * Fetches all appointments with pagination support
 */
export const fetchAllAppointments = async (params: AppointmentQueryParams) => {
  const { page, size, status, fromDate, toDate } = params;

  if (isProduction()) {
    let url = `v1/appointments?page=${page}&size=${size}`;

    if (status) url += `&status=${status}`;
    if (fromDate) url += `&fromDate=${fromDate}`;
    if (toDate) url += `&toDate=${toDate}`;

    return await http.get(url);
  } else {
    // Generate mock data
    return appointmentMockService.getMockAppointments(params);
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
    const mockAppointment = appointmentMockService.getMockAppointmentById(appointmentId);
    return Promise.resolve({ data: mockAppointment });
  }
};