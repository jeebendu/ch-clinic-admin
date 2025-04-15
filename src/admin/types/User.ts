
import { Branch } from "./branch";

export interface Permission {
  id: number;
  module: {
    id: number;
    name: string;
    code: string;
  };
  read: boolean;
  write: boolean;
  upload: boolean;
  print: boolean;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  branch: Branch;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  effectiveTo: Date;
  effectiveFrom: Date;
  role: Role;
  image: string;
}
