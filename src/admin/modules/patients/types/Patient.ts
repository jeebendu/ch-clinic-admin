
export type UserRole = "admin" | "doctor" | "staff" | "patient";

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// export interface Patient {
//   id: string;
//   patientId?: string; // Unique patient ID
//   firstName: string;
//   lastName: string;
//   fullName: string; // Added this property
//   dateOfBirth: string;
//   age?: number;
//   gender: "Male" | "Female" | "Other";
//   contactNumber: string;
//   email: string;
//   address: string;
//   lastVisit?: string;
//   insuranceProvider?: string;
//   insurancePolicyNumber?: string;
//   medicalHistory?: string;
//   emergencyContact?: {
//     name: string;
//     relationship: string;
//     phone: string;
//   };
//   photoUrl?: string;
//   createdAt: string;
// }
