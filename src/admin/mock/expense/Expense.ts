import { PaymentType } from "@/admin/types/newModel/PaymentType";


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
}

export interface ExpenseItem {
    id: number;
    description: string;
    price: number;
    qty: number;
    total: number;
}