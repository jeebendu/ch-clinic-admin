
import { Plan } from "../../subscription/types/Plan";
import { ClinicStatus } from "./ClinicStatus";

export interface Tenant {
  id?: number;
  status: string;
  clientId: string;
  clientUrl: string;
  title: string;
  favIcon: string;
  bannerHome: string;
  logo: string;
  schemaName: string;
  clinicStatus?: ClinicStatus;
    plan: Plan;
}
