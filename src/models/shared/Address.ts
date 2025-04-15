
export interface Country {
  id: number;
  name: string;
  code: string;
  iso: string;
  status: boolean;
}

export interface State {
  id: number;
  name: string;
  country: Country;
}

export interface District {
  id: number;
  name: string;
  state: State;
}
