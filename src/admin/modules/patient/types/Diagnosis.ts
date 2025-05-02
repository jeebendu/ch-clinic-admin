
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "./Patient";

export interface Diagnosis {
  id: number;
  patient: Patient;
  doctor: {
    id: number;
    firstname: string;
    lastname: string;
  };
  date: Date;
  symptoms: string;
  diagnosis: string;
  notes: string;
  followUpDate: Date | null;
  isFollowUpRequired: boolean;
}
