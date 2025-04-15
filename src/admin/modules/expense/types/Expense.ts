
import { PaymentType } from "../../payment/types/PaymentType";

export interface Expense {
  id: number;
  uid: string;
  expenseTime: Date;
  createdTime: Date;
  paymentType: PaymentType;
  status: Boolean;
  remark: string;
  description: string;
  items: ExpenseItem;
  subtotal: number;
  discount: number;
  grandTotal: number;
  approved: boolean;
}

export interface ExpenseItem {
  id: number;
  description: string;
  price: number;
  qty: number;
  total: number;
}
