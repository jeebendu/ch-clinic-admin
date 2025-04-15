
import { Patient } from "../../patients/types/Patient";
import { Courier } from "../../config/types/Courier";
import { PaymentType } from "../../payment/types/PaymentType";
import { Product } from "../../catalog/types/Product";

export interface Repair {
  id: number;
  uid: string;
  paymentType?: PaymentType;
  courier: Courier;
  repairProblem: RepairProblemData;
  status: Boolean;
  remark: string;
  slNo: number;
  items?: RepairItem;
  subTotal: number;
  discount: number;
  grandTotal: number;
  totalPaid: number;
  pendingBalance: number;
  product: Product;
  patient: Patient;
  repairBillingAddress: BillTo;
  repairShippingAddress: ShipTo;
  orderDate: Date;
  orderId: String;
  rushorder: boolean;
  repairProductinfoDto: ProductInfo;
  repairSpeakerDto: Speaker;
  repairStatus: RepairStatus;
  repairPaymentList: RepairPayment;
  repairCourierList: RepairCourier;
  comments: string;
}

export interface RepairItem {
  id: number;
  productName: string;
  price: number;
  qty: number;
  total: number;
}

export interface BillTo {
  name: string;
  city: string;
  state: string;
  address: string;
  pin: string;
  phone: string;
  email: string;
}

export interface ShipTo {
  name: string;
  city: string;
  state: string;
  address: string;
  pin: string;
  phone: string;
  email: string;
}

export interface ProductInfo {
  id?: any;
  name?: any;
  model?: any;
  snLeft?: any;
  snRight?: any;
}

export interface Speaker {
  id?: any;
  size?: any;
  serialLeft?: any;
  serialRight?: any;
  left: boolean;
  right: boolean;
  modelLeft?: any;
  modelRight?: any;
}

export interface RepairStatus {
  id?: number;
  name: string;
  type: string;
}

export interface RepairPayment {
  id?: number;
  repairStatus: RepairStatus;
  repair: Repair;
  paymentType: PaymentType;
  date: Date;
  amount: number;
}

export interface RepairProblemData {
  id: number;
  type: string;
  name: string;
  status: boolean;
}

export interface DataMap {
  key: string | number;
  value: string | number | boolean;
}

export interface RepairCourier {
  id?: number;
  repair: Repair;
  repairStatus: RepairStatus;
  courier: Courier;
  date: Date;
  shipmentType: ShipmentType;
  amount: number;
  sendDate: Date;
  sendBy: string;
  recievedDate: Date;
  recievedBy: string;
  trackNo: string;
  cost: string;
}

export interface ShipmentType {
  id: number;
  name: string;
}
