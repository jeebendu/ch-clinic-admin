
import { Clinic } from "@/admin/modules/clinics/types/Clinic";

// Mock implementation
export const searchClinics = async (query?: string): Promise<Clinic[]> => {
  // In a real app, this would call an API with the search query
  const mockClinics: Clinic[] = [
    { 
      id: 1, 
      uid: "c1", 
      name: "Main Clinic", 
      email: "main@example.com", 
      contact: "1234567890", 
      address: "123 Main St", 
      plan: {
        features: {
          id: 1,
          module: { id: 1, name: "Basic Module" },
          print: true
        }
      }
    },
    { 
      id: 2, 
      uid: "c2", 
      name: "Downtown Clinic", 
      email: "downtown@example.com", 
      contact: "1234567891", 
      address: "456 Downtown", 
      plan: {
        features: {
          id: 1,
          module: { id: 1, name: "Basic Module" },
          print: true
        }
      }
    },
  ];

  if (!query) return mockClinics;
  
  return mockClinics.filter(clinic => 
    clinic.name.toLowerCase().includes(query.toLowerCase()));
};

export default { searchClinics };
