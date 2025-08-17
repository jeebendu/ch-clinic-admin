
export interface Country {
  id: number;
  name: string;
  code: string;
  iso2: string;
  iso3: string;
  phonecode: string;
}

export interface State {
  id: number;
  name: string;
  code: string;
  country: Country;
}

export interface District {
  id: number;
  name: string;
  state: State;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  city: string;
  pincode: number;
  latitude: number;
  longitude: number;
  mapurl: string;
  image: string;
  active: boolean;
  primary: boolean;
  state: State;
  district: District;
  country: Country;
}
