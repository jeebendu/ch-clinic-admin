
export interface Plan {
  features: featureList;
}

export interface featureList {
  id: number;
  module: Module;
  print: boolean;
}

export interface Module {
  id: number;
  name: string;
}

export interface Clinic {
  id: number;
  uid: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: Plan;
}

export interface Element {
  selected?: any;
  id: number;
  uid: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: Plan;
}
