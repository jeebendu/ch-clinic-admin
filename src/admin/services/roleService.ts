
import { Role } from "@/admin/modules/users/types/User";

// Mock implementation
export const getRoles = async (): Promise<Role[]> => {
  const mockRoles: Role[] = [
    { id: 1, name: "Admin", code: "ADMIN" },
    { id: 2, name: "Doctor", code: "DOCTOR" },
    { id: 3, name: "Receptionist", code: "RECEPTIONIST" },
    { id: 4, name: "Manager", code: "MANAGER" },
    { id: 5, name: "Patient", code: "PATIENT" },
  ];

  return mockRoles;
};

export default { getRoles };
