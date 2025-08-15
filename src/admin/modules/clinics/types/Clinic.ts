
export interface Clinic {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: string;
  adminUserId?: string;
  adminEmail?: string;
  adminPhone?: string;
  createdTime?: Date;
  modifiedTime?: Date;
}
