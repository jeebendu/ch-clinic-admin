
export interface Tenant {
  id: number;
  name: string;
  title: string;
  logo: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}
