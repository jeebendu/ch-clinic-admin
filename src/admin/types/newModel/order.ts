import { Distributor } from "./Distributor";
import { PaymentType } from "./PaymentType";
import { Product } from "./Product";


export interface Order {

    id: number;
    uid: string;
    orderTime: Date;
    createdTime: Date;
    paymentType: PaymentType;
    approved: Boolean;
    remark: string;
    items: OrderItem;
    vendor: Distributor;
    subtotal: number;
    discount: number;
    grandTotal: number;
    product?: Product;
    approvedTime: Date;
    totalDiscount: number;
    totalGst: number;
    paidAmount: number;
    balance: number ;
}




export interface OrderItem {
    id?: number
    product: Product;

    pack?: string;
    description?: string
    mrp: number;
    price: number;
    qty: number ;
    total: number;
    hsnCode?: string;

    batch?: string;
    expiry?: string;
    discountPercent: number;
    discountAmount: number;
    gstPercent: number;
    taxAmount?: number;
    manufactureMonth?: number;
    manufactureYear?: number;
    expiryMonth?: number;
    expiryYear?: number;
    freeQty: number;
    mfg?: string;
    serials?: ItemSerial;
}

export interface ItemSerial {
    id?: number
    serialId?: number
    serialNo?: String
}

export interface Pack {
    id?: number
    name?: string;
}


export interface SearchPurchase {

    vendorName: String ;
    approved: any;
    paymentType: any;
    fromDate: Date;
    toDate: Date;

}