import { Country, State } from "../../core/types/Address";
import { District } from "../../core/types/District";

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active?: boolean;
  state: State | null;
  district: District | null;
  city: string;
  country:Country | null;
  mapUrl?: string;
  mapurl?: string;
  pincode: number;
  image?: string;
  latitude?: number;
  longitude?: number;
}
