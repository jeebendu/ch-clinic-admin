
export interface Slot {
  id?: number;
  date?: Date;
  startTime?: string;
  endTime?: string;
  doctorId?: number;
  branchId?: number;
  capacity?: number;
  isRecurring?: boolean;
  recurringDays?: string[];
}

export interface AppointmentQueryParams {
  doctorId?: number;
  patientId?: number;
  branchId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
  pageNumber?: number;
}
