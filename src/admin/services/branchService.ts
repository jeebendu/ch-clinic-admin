
import { Branch } from "@/admin/modules/branch/types/Branch";

// Mock implementation
export const fetchBranches = async (clinicId?: number): Promise<Branch[]> => {
  // In a real app, this would call an API with the clinicId
  const country = { id: 1, name: "Country 1" };
  const state = { id: 1, name: "State 1", country };
  const district = { id: 1, name: "District 1", state };

  const mockBranches: Branch[] = [
    { 
      id: 1, 
      name: "Main Branch", 
      code: "MB", 
      location: "Central", 
      active: true, 
      state, 
      district, 
      country, 
      city: "City 1", 
      mapUrl: "", 
      pincode: 123456,
      image: "",
      latitude: 0,
      longitude: 0
    },
    { 
      id: 2, 
      name: "Secondary Branch", 
      code: "SB", 
      location: "East", 
      active: true, 
      state, 
      district, 
      country, 
      city: "City 1", 
      mapUrl: "", 
      pincode: 123456,
      image: "",
      latitude: 0,
      longitude: 0
    },
    { 
      id: 3, 
      name: "Downtown Branch", 
      code: "DB", 
      location: "West", 
      active: true, 
      state, 
      district, 
      country, 
      city: "City 2", 
      mapUrl: "", 
      pincode: 123457,
      image: "",
      latitude: 0,
      longitude: 0
    },
  ];

  if (!clinicId) return mockBranches;
  
  // In a real app, you would filter by clinic ID
  return mockBranches;
};

export default { fetchBranches };
