
import { Branch } from "./Branch";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  effectiveTo?: Date;
  effectiveFrom?: Date;
  branch: Branch;
  role: Role;
  image: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  module: any;
  read: boolean;
  write: boolean;
  upload: boolean;
  print: boolean;
}
