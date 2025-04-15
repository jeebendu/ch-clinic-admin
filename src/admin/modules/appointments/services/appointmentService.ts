
import { Slot } from "@/admin/types/allappointment";

export interface AppointmentQueryParams {
  doctorId?: number;
  patientId?: number;
  branchId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
  pageNumber?: number;
  // Additional fields needed for appointmentMockService
  page?: number;
  size?: number;
  statuses?: string[];
  fromDate?: string;
  toDate?: string;
  searchTerm?: string | null;
  branches?: number[];
}

export const fetchAppointmentsByDoctorId = async (params: AppointmentQueryParams) => {
  // Import dynamically to avoid circular dependencies
  const { getMockAppointments } = await import('@/admin/mock/appartment/appartmentMockService');
  return getMockAppointments(params);
};

export const getAppointmentById = async (id: string | number) => {
  // Mock implementation
  const { getMockAppointments } = await import('@/admin/mock/appartment/appartmentMockService');
  const response = await getMockAppointments({});
  const appointment = response.data.content.find((app: any) => app.id === Number(id));
  return { data: appointment };
};

export const updateAppointmentStatus = async (id: number, status: string) => {
  // Mock implementation
  return Promise.resolve({ success: true });
};

// Export for use in mock services
export { AppointmentQueryParams };
