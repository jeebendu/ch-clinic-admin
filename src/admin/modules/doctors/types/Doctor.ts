
export interface EnquiryServiceType {
  id: number;
  name: string;
  price?: number;
}

export interface Specialization {
  id: number;
  name: string;
}

export interface Doctor {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  email: string;
  uid: string;
  mobile: number;
  desgination: string;
  specialization: string;
  specializationList: Specialization[];
  qualification: string;
  joiningDate: Date;
  user: {
    id: number;
    branch: {
      id: number;
      name: string;
      code: string;
      location: string;
      active: boolean;
      state: any | null;
      district: any | null;
      country: any | null;
      city: string;
      mapUrl?: string;
      pincode: number;
      image: string;
      latitude: number;
      longitude: number;
    };
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    effectiveTo: Date | null;
    effectiveFrom: Date | null;
    role: {
      id: number;
      name: string;
      permissions: any[];
    };
    image: string;
  } | null;
  status: string;
  external: boolean;
  external_temp: any | null;
}
