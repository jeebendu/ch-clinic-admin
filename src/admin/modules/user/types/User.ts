
import { Branch } from "@/admin/modules/branch/types/Branch";
import { Role } from "../submodules/roles/types/Role";

export interface User {
  id: number;
  branch?: Branch;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  password?: string;
  effectiveTo?: Date;
  effectiveFrom?: Date;
  role?: Role | string;
  roleobj?: Role;
  image?: string;
  token?: string;
  branchId?: number;
  branchIds?: number[];
}

export interface AuthUser {
  email: string | null;
  reason: "login";
  tenant: "dev";
  otp: string | null;
  authToken: string | null;
  phone: string | null;
}


export interface Staff {
  firstname: string;
  lastname: string;
  id: number;
  userId: number;
  dob: Date;
  whatsappNo: number;
  age: string;
  gender: any;
  lastVisitedOn: Date;
  user: User;
  name: string;
  branchList: Branch[];
}
