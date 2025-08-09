
import { Patient } from "../../patient/types/Patient";
import { Branch } from "../../branch/types/Branch";

export enum LabOrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum LabOrderPriority {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  STAT = 'STAT'
}

export enum LabOrderItemStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface TestType {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
  active: boolean;
}

export interface TestCategory {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  testTypes?: TestType[];
}

export interface LabOrderItem {
  id?: number;
  testTypeId: number;
  testType?: TestType;
  status: LabOrderItemStatus;
  sampleCollected: boolean;
  sampleCollectionDate?: string;
}

export interface LabOrder {
  id?: number;
  visitId?: number;
  patient: Patient;
  branch: Branch;
  branchId: number;
  orderNumber: string;
  status: LabOrderStatus;
  priority: LabOrderPriority;
  orderDate: string;
  expectedDate?: string;
  referringDoctor?: string;
  comments?: string;
  labOrderItems: LabOrderItem[];
}

export interface LabOrderFormData {
  patientId: number;
  branchId: number;
  priority: LabOrderPriority;
  referringDoctor?: string;
  comments?: string;
  testTypeIds: number[];
  expectedDate?: string;
}
