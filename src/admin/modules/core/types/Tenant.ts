
export interface Tenant {
  id: number;
  clientId: string;
  name: string;
  title?: string;
  logo?: string;
  status?: string;
  databaseStatus?: string;
  userCreationStatus?: string;
  adminUserId?: string;
  adminEmail?: string;
  adminPhone?: string;
  schemaVersion?: string;
  createdTime?: Date;
  modifiedTime?: Date;
}
