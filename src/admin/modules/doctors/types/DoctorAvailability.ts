
export type DoctorAvailability = {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
};
  
export type DoctorLeave = {
  id: number;
  doctorId: number;
  startDate: string;
  endDate: string;
  reason: string;
};
