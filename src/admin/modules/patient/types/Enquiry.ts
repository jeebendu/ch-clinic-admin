
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "./Patient";

export interface Enquiry {
  id: number;
  patient: Patient;
  doctor: Doctor;
  date: Date;
  subject: string;
  message: string;
  response?: string;
  isResolved: boolean;
}
