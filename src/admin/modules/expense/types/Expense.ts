import { Staff } from "../../user/types/User";


export interface Expense {
    id: number;
    uid: string;
    expenseTime: Date;
    createdTime: Date;
    paymentType: PaymentType;
    status: boolean;
    remark: string;
    description: string;
    items: ExpenseItem[];
    subtotal: number;
    discount: number;
    grandTotal: number;
    approved: boolean;
    approvedBy:Staff;
    createdBy: string;
    approvedTime: Date;
  }
  
  export interface ExpenseItem {
    id: number;
    description: string;
    price: number;
    qty: number;
    total: number;
  }
  
  export interface PaymentType {
      id:number;
      name:string;
  }
  