
export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  default?: boolean;
  active?: boolean;
  display?: boolean;
  createdTime?: string;
  modifiedTime?: string | null;
  createdBy?: string;
  modifiedBy?: string | null;
}

export interface Permission {
  id: number;
  module: Module;
  read: boolean;
  write: boolean;
  upload: boolean;
  print: boolean;
  approve?: boolean;
  createdTime?: string;
  modifiedTime?: string | null;
  createdBy?: string;
  modifiedBy?: string | null;
}

export interface Module {
  id: number;
  name: string;
  code: string;
  createdTime?: string;
  modifiedTime?: string | null;
  createdBy?: string;
  modifiedBy?: string | null;
}
