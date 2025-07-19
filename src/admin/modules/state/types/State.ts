
import { Country } from "../../country/types/Country";

export interface State {
  id: number;
  name: string;
  code: string;
  country: Country;
  countryId: number;
}
