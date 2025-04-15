
import { State } from "./State";
import { District } from "./District";
import { Country } from "./Country";

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active: boolean;
  state: State;
  district: District;
  country: Country;
  city: string;
  mapUrl: string;
  pincode: number;
  image: string;
  latitude: number;
  longitude: number;
}
