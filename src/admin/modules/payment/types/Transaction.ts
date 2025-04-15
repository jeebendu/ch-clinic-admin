
import { PaymentType } from "./PaymentType";
import { Patient } from "../../patients/types/Patient";

export interface Transaction {
  id: number;
  transactionDate: Date;
  amount: number;
  description: string;
  paymentType: PaymentType;
  reference?: string;
  patient?: Patient;
  isRefund: boolean;
  status: TransactionStatus;
  type?: PaymentType;
  withdraw?: number;
  deposit?: number;
  total?: number;
  remark?: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
