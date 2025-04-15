
import { Doctor } from "../../doctor/types/Doctor";
import { Patient } from "./Patient";

export interface Dental {
  id: number;
  name: String;
}

export interface ExaminationDental {
  id: number;
  doctor: Doctor;
  date: Date;
  note: String;
  treatmentType: String;
  examination: String;
  toothNo: number;
}

export interface ExaminationDentalList {
  id: number;
  patient: Patient;
  toothNo: number;
  doctor: Doctor;
  date: Date;
  treatmentType: String;
  examination: String;
  price: number;
  discount: number;
  grandTotal: number;
  active: boolean;
  note: String;
}
