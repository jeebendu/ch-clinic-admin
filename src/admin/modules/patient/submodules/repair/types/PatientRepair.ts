import { Patient } from "../../../types/Patient";


export interface PatientRepair {
  id: number;
  patient: Patient;
  itemName: string;
  problemDescription: string;
  dateReceived: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  cost: number;
  status: RepairStatus;
  notes?: string;
}

export type RepairStatus = 'received' | 'in-progress' | 'waiting-for-parts' | 'completed' | 'delivered' | 'cancelled';
