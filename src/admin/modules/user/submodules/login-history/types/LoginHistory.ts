import { User } from "../../../types/User";

// export interface LoginHistory {
//   id: number;
//   user: User;
//   loginTime: Date;
//   logoutTime?: Date;
//   ipAddress: string;
//   deviceInfo: string;
//   status: LoginStatus;
// }
export interface LoginHistory {
  id: number;
  user?: User; 
  loginTime: string;
  logoutTime: string;
  ipAddress: string;
  userAgent: string;
  status: boolean;
  userName: string;
  countryCode: string;
  country: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  mobile: boolean;
}

export type LoginStatus = 'successful' | 'failed' | 'locked';
