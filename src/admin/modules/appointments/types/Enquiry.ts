
import { Doctor } from "./Doctor";
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
