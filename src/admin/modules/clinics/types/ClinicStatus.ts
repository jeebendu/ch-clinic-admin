
export interface ClinicStatus {
  databaseStatus: 'created' | 'pending' | 'failed';
  schemaVersion: string;
  userCreationStatus: 'created' | 'pending' | 'failed';
  lastPasswordResetSent?: string; // timestamp
  adminUserId?: number;
  adminEmail?: string;
  adminPhone?: string;
}
