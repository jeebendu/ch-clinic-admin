
export interface Customer {
  id: number;
  firstName: String;
  lastName: String;
  phone: string;
  email: String;
  address: String;
}

export interface CustomerLedger {
  id: number;
  customer: Customer;
  txnDate: any;
  credit: number;
  debit: number;
  balance: number;
  remark: string;
}
