
import { Product } from "../../catalog/types/Product";
import { Patient } from "../../patients/types/Patient";
import { PaymentType } from "../../payment/types/PaymentType";
import { Branch } from "../../shared/types/Branch";
import { Customer } from "../../customers/types/Customer";

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

export interface SalesOrder {
  id: number;
  orderNumber: string;
  orderDate: Date;
  deliveryDate?: Date;
  status: SalesOrderStatus;
  total: number;
  discount: number;
  tax: number;
  grandTotal: number;
  patient?: Patient;
  branch: Branch;
  paymentType: PaymentType;
  items: SalesOrderItem[];
  paid: boolean;
  notes?: string;
}

export interface SalesOrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type SalesOrderStatus = 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
