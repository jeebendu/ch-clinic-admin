import { Doctor } from "@/admin/modules/doctor/types/Doctor";
import { Patient } from "../../../types/Patient";

export interface Dental {
    id: number;
    name: string;
}

export interface ExaminationDental {
    id: number;
    doctor: Doctor;
    date: Date;
    note: string;
    treatmentType: string;
    examination: string;
    toothNo: number[];
}

export interface ExaminationDentalList {
    id: number;
    patient: Patient;
    toothNo: number;
    doctor: Doctor;
    date: Date;
    treatmentType: string;
    examination: string;
    price: number;
    discount: number;
    grandTotal: number;
    active: boolean;
    note: string;
}