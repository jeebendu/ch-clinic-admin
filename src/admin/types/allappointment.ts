
export interface Slot {
  id: number;
  start: string;
  end: string;
  status: string;
}

export interface AllAppointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  slot?: Slot;
}
