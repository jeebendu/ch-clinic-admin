
import { District } from "../../core/types/Address";
import { State } from "../../core/types/Address";
import { Country } from "../../core/types/Address";
import { Clinic } from "../../clinics/types/Clinic";

export interface Branch {
  id: number;
  name: string;
  code?: string;
  location: string;
  city: string;
  district?: District;
  state?: State;
  country?: Country;
  pincode: number;
  active: boolean;
  primary: boolean;
  mapurl?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  clinic?: Clinic;
}
