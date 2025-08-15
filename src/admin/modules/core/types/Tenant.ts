
export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  clinicStatus: string;
  clientUrl?: string;
  clientId?: string;
}
