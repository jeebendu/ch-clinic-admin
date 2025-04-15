
import { Module } from "./Module";

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
  approve: boolean;
}

export interface Module {
  id: number;
  name: string;
  code: string;
}
