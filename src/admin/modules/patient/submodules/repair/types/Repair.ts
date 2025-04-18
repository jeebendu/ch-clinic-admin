import { Patient } from "../../../types/Patient";
import { Product } from "../../../types/Product";
import { Courier, RepairCourier } from "../submodules/repairCourier/types/RepairCourier";
import { RepairPayment } from "../submodules/repairPayment/types/RepairPayment";


export interface Repair {
    id: number;
    uid: string;
    paymentType?: PaymentType;
    courier: Courier;
    repairProblem: RepairProblemData[];
    status: boolean;
    remark: string;
    slNo: number;
    items?: RepairItem[];
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
    orderId: string;
    rushorder: boolean;
    repairProductinfoDto: ProductInfo;
    repairSpeakerDto: Speaker;
    repairStatus: RepairStatus;
    repairPaymentList: RepairPayment[];
    repairCourierList: RepairCourier[];
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

export interface Fit {
    id?: number;
    wrongcanalDirection: boolean;
    tightAllover: boolean;
    canaltooShort: boolean;
    canaltooLong: boolean;
    tightCanal: boolean;
    loose: boolean;
    tightHelix: boolean;
    protrudes: boolean;
    tightAntitragus: boolean;
    feedbackFit: boolean;
    worksoutofYear: boolean;
}

export interface Condition {
    id: number;
    dead: boolean;
    internalfeedback: boolean;
    receiverpushedin: boolean;
    transducerbroken: boolean;
    accessorymissing: boolean;
    transducersealloose: boolean;
    damagedcrosscord: boolean;
    poortapervc: boolean;
    vcintermittent: boolean;
    brokenswitch: boolean;
    wheeloffvc: boolean;
    loosevc: boolean;
    vcbroken: boolean;
    tightvc: boolean;
    putpushedin: boolean;
    deadtelecoil: boolean;
    waterdamaged: boolean;
    removeaccessory: boolean;
    pluggedwithwax: boolean;
    fades: boolean;
}

export interface CaseDefect {
    id?: number;
    batterystuckinaid: boolean;
    bdwontclosecompletely: boolean;
    allergyproblem: boolean;
    hingepinbroken: boolean;
    holeinshell: boolean;
    crackedshell: boolean;
    faceplateoff: boolean;
    brokenbattery: boolean;
    holeinvent: boolean;
}

export interface Response {
    id?: number;
    booming: boolean;
    weak: boolean;
    noisy: boolean;
    staticnoise: boolean;
    noutput: boolean;
    toostrong: boolean;
    occludes: boolean;
    circuitnoise: boolean;
    distorted: boolean;
    tinny: boolean;
    tooweak: boolean;
    others: boolean;
}

export interface RepairStatus {
    id: number;
    name: string;
    type: string;
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

export interface PaymentType {
    id:number;
    name:string;
}