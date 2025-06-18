
export interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  gender: string;
  dob: string | Date;
  age?: number;
}
