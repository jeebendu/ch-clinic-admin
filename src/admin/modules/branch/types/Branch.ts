
import { Country } from "@/admin/modules/config/submodules/country/types/Country";
import { State } from "@/admin/modules/config/submodules/state/types/State";
import { District } from "@/admin/modules/config/submodules/district/types/District";

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active: boolean;
  primary: boolean; // Added missing property
  state: State;
  district: District;
  country: Country;
  city: string;
  mapurl: string;
  pincode: number;
  image: string;
  latitude: number;
  longitude: number;
}
