
export interface Transaction {
  id: number;
  type?: {
    id: number;
    name: string;
  };
  withdraw?: number;
  deposit?: number;
  total: number;
  remark?: string;
}
