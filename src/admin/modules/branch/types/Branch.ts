
import { State } from "../../core/types/State";
import { District } from "../../core/types/District";
import { Country } from "../../core/types/Country";
import { Clinic } from "../../clinic/types/Clinic";

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active: boolean;
  primary: boolean;
  state: State;
  district: District;
  country: Country;
  city: string;
  mapurl: string;
  pincode: number;
  image: string;
  latitude: number;
  longitude: number;
  clinic?: Clinic;
}
