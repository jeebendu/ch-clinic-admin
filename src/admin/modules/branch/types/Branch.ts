
import { Country, District, State } from "../../core/types/Address";

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  mapurl: string;
  pincode: number;
  image: string;
  latitude: number;
  longitude: number;
  state: State;
  district: District;
  country: Country;
  city: string;
  active: boolean;
  primary: boolean;
  clinic?: {
    id: number;
    name: string;
  };
}
