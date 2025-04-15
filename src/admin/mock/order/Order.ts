import { Customer } from "@/admin/types/newModel/Customer";
import { PaymentType } from "@/admin/types/newModel/PaymentType";
import { Product } from "@/admin/types/newModel/Product";


export interface Order {
    id: number;
    uid: string;
    orderTime: Date;
    createdTime: Date;
    paymentType?: PaymentType;
    customer: Customer;
    status: boolean;
    remark: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    paid: number;
    pending: number;
    grandTotal: number;
    product: Product;
    paidAmount: number;
    discountType: string;
    discountValue: number;
    balance: number;
    customer_type: any;
}

export interface OrderItem {
    id: number;
    productName: string;
    productId: number;
    price: number;
    qty: number;
    qtyType: string;
    total: number;
    serials: ItemSerial[];
    batch: ItemSerial;
    _product: Product;
}

export interface ItemSerial {
    id: number;
    serialId: number;
    serialNo: string;
}

export interface OrderSearch {
    customerName: string;
    paymentType: any;
    fromDate: any;
    toDate: any;
}