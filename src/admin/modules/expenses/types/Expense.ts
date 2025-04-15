
export interface ExpenseItem {
  id: number;
  description: string;
  price: number;
  qty: number;
  total: number;
}

export interface Expense {
  id: number;
  uid: string;
  expenseTime: Date;
  createdTime: Date;
  paymentType: {
    id: number;
    name: string;
  };
  status: boolean;
  remark: string;
  description: string;
  items: ExpenseItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  approved: boolean;
}
