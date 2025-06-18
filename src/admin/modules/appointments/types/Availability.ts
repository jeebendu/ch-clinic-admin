
export interface AvailabilityTimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime?: string;
  capacity?: number;
}

export interface DayAvailability {
  day: string;
  isAvailable: boolean;
  slots: AvailabilityTimeSlot[];
}

export interface AvailabilitySettings {
  generalAvailability: DayAvailability[];
  clinicAvailability: {
    [clinicId: string]: DayAvailability[];
  };
  appointmentFees: string;
}
