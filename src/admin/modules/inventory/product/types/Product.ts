import { Branch } from "@/admin/modules/branch/types/Branch";
import { Brand } from "@/admin/modules/patient/types/Product";


export interface Product {
    id: number;
    name: string;
    price: string;
    buyprice: number;
    specialprice: number;
    qty: string;
    qtyLoose: number;
    stripsPerBox: number;
    capPerStrip: number;
    ram: string;
    storage: string;
    sku: string;
    brand: Brand;
    modelno: number;
    rackNo: string;
    color: string;
    warranty: string;
    smallimage: string;
    largeimage: string;
    description: string;
    branch: Branch;
    category: Category;
    serials: ProductItem[];
    batchList: any[];
    isSerialNoEnable: boolean;
    batched: boolean;
    type: ProductType;
}

export interface ProductItem {
    id: number;
    serialNo: string;
    qty: number;
}

export interface StockConfig {
    id: number;
    qtyMin: number;
    expMonth: number;
}

export interface SearchObj {
    name: string;
    brand: Brand;
    category: Category;
}

// export interface Brand {
//     id:number
//     name:string
// }
export interface Category {
    id:number
    name:string
}
export interface ProductType {
    id:number
    name:string
    strip:boolean
}