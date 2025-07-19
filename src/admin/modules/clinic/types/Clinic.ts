
export interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
}

export interface Clinic {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  plan: Plan;
  status: 'active' | 'inactive' | 'pending';
  adminUserId?: number;
  adminEmail?: string;
  adminPhone?: string;
  clientUrl?: string;
}
