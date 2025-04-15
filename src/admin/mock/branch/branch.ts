
import { Country } from "@/admin/types/country";
import { State } from "@/admin/types/state";
import { District } from "@/admin/types/district";

export interface Branch {
  id: number;
  name: string;
  location: string;
  mapurl: string;
  pincode: number;
  code: string;
  country: Country;
  state: State;
  district: District;
  city: string;
}
