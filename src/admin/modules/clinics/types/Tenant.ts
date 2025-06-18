
export interface Tenant {
  id: number;
  name: string;
  url: string;
  phone: string;
  clientId: string;
  clientUrl: string;
  title: string;
  favIcon: string;
  bannerHome: string;
  logo: string;
  status: string;
  schemaName: string;
  clinicStatus?: ClinicStatus; // Added this property
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
