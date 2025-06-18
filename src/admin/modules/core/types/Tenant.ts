
export interface Tenant {
  id?: number;
  name: string;
  url: string;
  title: string;
  favIcon: string;
  bannerHome: string;
  logo: string;
  phone: string;
  description?: string;
  info?: string;
  // Clinic-specific fields
  status?: string;
  clientId?: string;
  clientUrl?: string;
  schemaName?: string;
  clinicStatus?: ClinicStatus;
  plan?: Plan;
}

export interface ClinicStatus {
  databaseStatus: 'created' | 'pending' | 'failed';
  schemaVersion: string;
  userCreationStatus: 'created' | 'pending' | 'failed';
  lastPasswordResetSent?: string;
  adminUserId?: number;
  adminEmail?: string;
  adminPhone?: string;
}

export interface Plan {
  id?: number;
  name?: string;
  features?: any;
}
