
import { Branch } from "../../branch/types/Branch";
import { Tenant } from "./Tenant";
import { Module } from "../../../modules/core/types/Module";

export interface featureList {
  id: number;
  module: Module;
  print: boolean;
}

export interface Plan {
  id?: number;
  name?: string;
  features?: featureList;
}

export interface Clinic {
  id: number;
  uid?: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan?: Plan;
  createdTime?: string;
  tenant?: Tenant;
  branchList?: Branch[];
  branches?: Branch[];
}
