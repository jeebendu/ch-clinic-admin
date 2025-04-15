
export interface Branch {
  id: number;
  name: string;
  code: string;
  location: string;
  active: boolean;
  state: any | null;
  district: any | null;
  country: any | null;
  city: string;
  mapUrl: string;
  pincode: number;
  image: string;
  latitude: number;
  longitude: number;
}
