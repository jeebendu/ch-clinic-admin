
export interface Order {
  id: number;
  uid: string;
  orderTime: Date;
  createdTime: Date;
  paymentType: any;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  status: boolean;
  remark: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  paid: number;
  pending: number;
  grandTotal: number;
  product: any;
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
  serials: any[];
  batch: {
    id: number;
    serialId: number;
    serialNo: string;
  };
  _product: any;
}
