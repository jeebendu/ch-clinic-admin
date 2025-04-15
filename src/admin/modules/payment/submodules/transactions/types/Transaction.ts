
import { PaymentType } from "../../payment-type/types/PaymentType";
import { Patient } from "@/admin/modules/patients/types/Patient";

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
}

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
