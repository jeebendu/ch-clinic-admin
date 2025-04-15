
import { Product } from "@/admin/modules/catalog/submodules/product/types/Product";
import { Branch } from "@/admin/modules/shared/types/Branch";

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
