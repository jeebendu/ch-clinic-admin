
export interface Tenant {
  id: string;
  name: string;
  title: string;
  logo?: string;
  status?: 'active' | 'inactive' | 'pending';
  databaseStatus?: string;
  userCreationStatus?: string;
  adminUserId?: string;
  adminEmail?: string;
  adminPhone?: string;
  schemaVersion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
