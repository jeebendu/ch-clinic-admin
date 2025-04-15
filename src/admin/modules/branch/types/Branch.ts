
export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active?: boolean;
  state: {
    id: number;
    name: string;
    country: {
      id: number;
      name?: string;
      code?: string;
      iso?: string;
      status?: boolean;
    };
  } | null;
  district: {
    id: number;
    name: string;
    state: {
      id: number;
      name: string;
      country: {
        id: number;
        name?: string;
        code?: string;
        iso?: string;
        status?: boolean;
      };
    };
  } | null;
  country: {
    id: number;
    name?: string;
    code?: string;
    iso?: string;
    status?: boolean;
  } | null;
  city: string;
  mapUrl?: string;
  mapurl?: string;
  pincode: number;
  image?: string;
  latitude?: number;
  longitude?: number;
}
