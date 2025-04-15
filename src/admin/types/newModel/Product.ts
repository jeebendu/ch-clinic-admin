
import { Brand } from './Brand';
import { Category } from './Category';
import { ProductType } from './ProductType';

export interface Product {
  id: number;
  name: string;
  price: number;
  buyprice: number;
  specialprice: number;
  qty: number;
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
  branchId: number;
  categoryId: number;
  brandId: number;
  category: Category;
  serials: {
    id: number;
    serialNo: string;
    qty: number;
  };
  batchList: any[];
  isSerialNoEnable: boolean;
  batched: boolean;
  type: ProductType;
}
