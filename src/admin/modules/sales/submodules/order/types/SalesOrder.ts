
import { Product } from "@/admin/modules/catalog/submodules/product/types/Product";
import { Patient } from "@/admin/modules/patients/types/Patient";
import { PaymentType } from "@/admin/modules/payment/submodules/payment-type/types/PaymentType";
import { Branch } from "@/admin/modules/shared/types/Branch";

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
