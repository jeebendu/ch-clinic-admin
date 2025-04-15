
import { Distributor } from "../../config/types/Distributor";
import { PaymentType } from "../../payment/types/PaymentType";
import { Product } from "../../catalog/types/Product";

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
  balance: number;
}

export interface OrderItem {
  id?: number;
  product: Product;
  pack?: string;
  description?: string;
  mrp: number;
  price: number;
  qty: number;
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
  productName?: string;
  productId?: number;
  qtyType?: string;
  _product?: Product;
}

export interface ItemSerial {
  id?: number;
  serialId?: number;
  serialNo?: String;
}

export interface Pack {
  id?: number;
  name?: string;
}

export interface SearchPurchase {
  vendorName: String;
  approved: any;
  paymentType: any;
  fromDate: Date;
  toDate: Date;
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  status: PurchaseOrderStatus;
  total: number;
  branch: Branch;
  items: PurchaseOrderItem[];
  notes?: string;
}

export interface PurchaseOrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PurchaseOrderStatus = 'draft' | 'ordered' | 'partial-received' | 'received' | 'cancelled';

// This is needed for the import
import { Branch } from "../../shared/types/Branch";
