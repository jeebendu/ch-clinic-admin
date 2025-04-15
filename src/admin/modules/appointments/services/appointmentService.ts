
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
}

// Export for use in mock services
export { AppointmentQueryParams };
