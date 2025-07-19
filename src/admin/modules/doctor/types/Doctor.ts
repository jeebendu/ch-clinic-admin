import { Branch } from "@/admin/modules/branch/types/Branch";

export interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  qualification: string;
  expYear: number;
  specialization: string;
  online: boolean;
  gender: string;
  uid?: string;
  specializationList?: { id: number; name: string; }[];
  branchList?: { branch: Branch }[];
}
