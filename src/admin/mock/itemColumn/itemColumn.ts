import { Distributor } from "@/admin/types/newModel/Distributor";


export interface ItemColumn {
    id: number;
    vendor: Distributor;
    startPoint: string;
    expSeparator: string;
    sn: any;
    hsn: any;
    mfg: any;
    name: any;
    pack: any;
    batch: any;
    exp: any;
    mrp: any;
    qty: any;
    free: any;
    rate: any;
    amount: any;
    dis: any;
    sgst: any;
    cgst: any;
    netAmount: any;
}

export interface ColumnPosition {
    id: number;
    name: number;
}