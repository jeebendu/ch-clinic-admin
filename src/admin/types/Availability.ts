
export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime?: string;
  capacity?: number;
}

export interface DayAvailability {
  day: string;
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface DoctorLeave {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface AvailabilitySettings {
  generalAvailability: DayAvailability[];
  clinicAvailability: {
    [clinicId: string]: DayAvailability[];
  };
  appointmentFees: string;
  leaves: DoctorLeave[];
}
