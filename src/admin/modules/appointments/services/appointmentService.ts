
import http from "@/lib/JwtInterceptor";
import { isProduction } from "@/utils/envUtils";
import { AppointmentQueryParams } from "../types/Appointment";

/**
 * Fetches appointments by doctor ID with pagination support
 */
export const fetchAppointmentsByDoctorId = async (params: AppointmentQueryParams) => {
  const { doctorId, page, size, status, fromDate, toDate, branches, statuses, searchTerm } = params;

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
};

/**
 * Fetches all appointments with pagination support
 */
export const fetchAllAppointments = async (params: AppointmentQueryParams) => {
  const { page, size, status, fromDate, toDate } = params;

  let url = `v1/appointments?page=${page}&size=${size}`;

  if (status) url += `&status=${status}`;
  if (fromDate) url += `&fromDate=${fromDate}`;
  if (toDate) url += `&toDate=${toDate}`;

  return await http.get(url);
};

/**
 * Updates an appointment's status
 */
export const updateAppointmentStatus = async (appointmentId: number, status: string) => {
  return await http.put(`v1/appointments/${appointmentId}/status`, { status });
};

/**
 * Fetch a single appointment by ID
 */
export const getAppointmentById = async (appointmentId: string | number) => {
  return await http.get(`/v1/appointments/id/${appointmentId}`);
};
