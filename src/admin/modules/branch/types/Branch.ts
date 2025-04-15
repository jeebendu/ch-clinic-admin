
import { State } from "@/admin/modules/shared/types/State";
import { District } from "@/admin/modules/shared/types/District";
import { Country } from "@/admin/modules/shared/types/Country";

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
