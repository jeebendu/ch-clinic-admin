
export interface Patient {
  id: number;
  uid: string;
  gender: string;
  dob: string | Date;
  age: number;
  address: string;
  whatsappNo?: string;
  problem?: string;
  refDoctor: any;
  consDoctorId?: number;
  remark?: string;
  pastRemark?: string;
  firstname: string;
  lastname: string;
  createdTime?: Date;
  user: any;
  photoUrl?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  fullName?: string;
  lastVisit?: string;
  medicalHistory?: string;
}

export type FamilyMember = any;
