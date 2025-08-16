import { Doctor } from "@/admin/modules/appointments/types/Doctor";
import { Patient } from "../../../types/Patient";
import { Branch } from "@/admin/modules/branch/types/Branch";

export interface Visit {
  id?: number | string;
  branch?: Branch;
  patient?: Patient;
  referByDoctor?: Doctor;
  consultingDoctor?: Doctor;
  complaints?: string;
  scheduleDate?: string;
  type?: string;
  status?: string;
  notes?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  paymentPaid?: number;
  referralDoctorName?: string | null;
  createdTime?: string;
  //[key: string]: any;
}
