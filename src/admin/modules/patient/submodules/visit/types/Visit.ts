
export interface Visit {
  id?: number | string;
  patient?: any;
  doctor?: any;
  scheduleDate?: string;
  type?: string;
  status?: string;
  notes?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  paymentPaid?: number;
  referralDoctorName?: string | null;
  [key: string]: any;
}
