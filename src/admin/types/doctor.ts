
export interface EnquiryServiceType {
  id: number;
  name: string;
  price?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch: any | null;
  username: string | null;
  password: string | null;
  role: any | null;
  image: string | null;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  uid: string;
  mobile: number;
  desgination: string;
  specialization: string;
  specializationList: any[];
  qualification: string;
  joiningDate: Date;
  user: any | null;
  status: string;
  external: boolean;
  external_temp: any | null;
}
