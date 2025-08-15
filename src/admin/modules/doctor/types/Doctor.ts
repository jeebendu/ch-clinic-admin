
import { Branch } from "../../branch/types/Branch";
import { User } from "../../user/types/User";

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  qualification: string;
  expYear: number;
  online: boolean;
  imageUrl?: string;
  gender: string;
  specializationList: Array<{
    id: number;
    name: string;
  }>;
  branch?: Branch;
  user?: User;
  createdTime?: Date;
  modifiedTime?: Date;
}
