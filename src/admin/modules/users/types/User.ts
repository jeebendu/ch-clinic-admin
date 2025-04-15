
export interface Role {
  id: number;
  name: string;
  permissions: {
    id: number;
    module: {
      id: number;
      name: string;
      code?: string;
    };
    read: boolean;
    write: boolean;
    upload: boolean;
    print: boolean;
  }[];
}

export interface User {
  id: number;
  branch: {
    id: number;
    name: string;
    code: string;
    location: string;
    active?: boolean;
    state: any;
    district: any;
    country: any;
    city: string;
    mapUrl?: string;
    pincode: number;
    image?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  name: string;
  username: string | null;
  email: string;
  phone: string;
  password: string | null;
  effectiveTo?: Date | null;
  effectiveFrom?: Date | null;
  role?: Role | null;
  image?: string | null;
}
