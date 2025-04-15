
import { Country } from "./country";
import { State } from "./state";
import { District } from "./district";

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active?: boolean;
  state: State | null;
  district: District | null;
  country: Country | null;
  city: string;
  mapUrl?: string;
  pincode: number;
  image?: string;
  latitude?: number;
  longitude?: number;
}
