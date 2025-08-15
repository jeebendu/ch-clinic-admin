
import { Specialization } from "./Specialization";

export interface Doctor {
  id: number;
  uid: string;
  firstname: string;
  lastname: string;
  fullName?: string;
  qualification: string;
  expYear: number;
  online: boolean;
  imageUrl?: string;
  gender: string;
  specializationList: Specialization[];
}
