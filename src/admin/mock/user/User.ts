import { Branch } from "@/admin/types/Branch";

export interface User {
  id: number;
  branch: Branch;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  effectiveTo?: Date;
  effectiveFrom?: Date;
  role: Role;
  image:string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  module: Module;
  read: boolean;
  write: boolean;
  upload: boolean;
  print: boolean;
}

export interface Module {
  id: number;
  name: string;
  code: string;
}

export interface AuthUser {
  email: string | null;
  reason: "login";
  tenant: "dev";
  otp: string | null;
  authToken: string | null;
  phone: string | null;
}
