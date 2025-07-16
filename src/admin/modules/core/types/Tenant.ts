
export interface Tenant {
  id: number;
  name: string;
  description?: string;
  clinicStatus: 'active' | 'inactive' | 'pending';
  clientUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
