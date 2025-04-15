
import { User } from "../users/types/User";

export interface LoginHistory {
  id: number;
  user: User;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress: string;
  deviceInfo: string;
  status: LoginStatus;
}

export type LoginStatus = 'successful' | 'failed' | 'locked';
