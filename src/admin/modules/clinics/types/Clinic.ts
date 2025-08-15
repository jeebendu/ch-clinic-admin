
import { Tenant } from "../../core/types/Tenant";

export interface Clinic {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: string;
  tenant?: Tenant;
  adminUserId?: string;
  adminEmail?: string;
  adminPhone?: string;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
