
import { Branch } from "../../branch/types/Branch";
import { District } from "../../core/types/District";
import { State } from "../../core/types/State";

export interface Doctor {
  id: number;
  name: string;
  mobile: string;
  email: string;
  qualification: string;
  branch: Branch;
  isVerified: boolean;
  additionalInfo?: AdditionalInfoDoctor;
}

export interface AdditionalInfoDoctor {
  id: number;
  registationNumber: string;
  registationCouncil: string;
  registationYear: string;
  degreeCollege: string;
  yearCompletionDegree: string;
  establishmentType?: "own" | "visit";
  establishmentName: string;
  establishmentCity: string;
  state: State;
  district: District;
}
