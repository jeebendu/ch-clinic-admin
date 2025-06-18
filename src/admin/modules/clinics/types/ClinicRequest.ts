
import { District } from "../../core/types/District";
import { Source } from "../../user/types/Source";

export interface ClinicRequest {
  id: number;
  name: string;
  contact: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  clientId: string;
  clientUrl: string;
  title: string;
  favIcon: string;
  bannerHome: string;
  logo: string;
  contactName: string;
  contactDesignation: string;
  address: string;
  city: string;
  district?: District;
  source?: Source;
  requestDate?: string;
}
