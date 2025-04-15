
import { PaymentType } from "@/admin/types/newModel/PaymentType";

export interface Transaction {
  id: number;
  type: PaymentType;
  withdraw?: number;
  deposit?: number;
  total: number;
  remark: string;
}
