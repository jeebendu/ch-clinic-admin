
import { Branch } from "../../branch/types/Branch";
import { Tenant } from "./Tenant";

export interface Clinic {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan?: {
    id: number;
    name: string;
  };
  createdTime?: string;
  tenant?: Tenant;
  branchList?: Branch[];
  branches?: Branch[];
}
