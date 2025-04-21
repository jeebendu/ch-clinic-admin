import { Branch } from "../../branch/types/Branch";
import { PaymentType } from "../../patient/submodules/repair/types/Repair";
import { Staff, User } from "../../user/types/User";

export interface Expense{
    id: number;
    description: string;
    paymentType: PaymentType;
    discount: number;
    grandTotal: number;
    expenseTime: Date;
    approved: boolean;
    approvedBy:Staff;
    approvedTime: Date;
    items: ExpenseItem[];
    createdBy:string;
    createdTime: Date;

}
export interface ExpenseItem {
    id: number;
    price: number;
    qty: number;
    total: number;
    description: string;
}
