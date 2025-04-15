
export interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  doctor?: any | null;
  branch?: {
    id: number;
    name: string;
    code: string;
    location: string;
    active: boolean;
    state: any | null;
    district: any | null;
    country: any | null;
    city: string;
    mapUrl: string;
    pincode: number;
    image: string;
    latitude: number;
    longitude: number;
  } | null;
  availableSlots: number;
  date: Date;
  duration: number;
  slotType: string;
  doctorId?: number;
  branchId?: number;
  capacity?: number;
  isRecurring?: boolean;
  recurringDays?: string[];
}
