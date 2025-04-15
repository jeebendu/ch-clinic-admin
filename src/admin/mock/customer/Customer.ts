export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    address: string;
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