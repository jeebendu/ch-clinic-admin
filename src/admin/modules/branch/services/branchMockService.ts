import { Branch } from "../types/Branch";
import { Country } from "../../core/types/Country";
import { State } from "../../core/types/State";
import { District } from "../../core/types/District";

const mockCountry: Country = {
  id: 1,
  name: "United States",
  code: "US"
};

const mockState: State = {
  id: 1,
  name: "California",
  code: "CA"
};

const mockDistrict: District = {
  id: 1,
  name: "Los Angeles",
  code: "LA",
  state: mockState
};

const mockBranches: Branch[] = [
  {
    id: 1,
    name: "Main Branch",
    location: "123 Main Street, Downtown",
    mapurl: "https://maps.google.com/...",
    pincode: 90210,
    code: "MB001",
    active: true,
    primary: true,
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Los Angeles",
    image: "",
    latitude: 34.0522,
    longitude: -118.2437
  },
  {
    id: 2,
    name: "Beverly Hills Branch",
    location: "456 Rodeo Drive, Beverly Hills",
    mapurl: "https://maps.google.com/...",
    pincode: 90210,
    code: "BH002",
    active: false,
    primary: false,
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Beverly Hills",
    image: "",
    latitude: 34.0736,
    longitude: -118.4004
  },
  {
    id: 3,
    name: "Santa Monica Branch",
    location: "789 Ocean Avenue, Santa Monica",
    mapurl: "https://maps.google.com/...",
    pincode: 90401,
    code: "SM003",
    active: true,
    primary: false,
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Santa Monica",
    image: "",
    latitude: 34.0083,
    longitude: -118.4961
  }
];

export const branchMockService = {
  getBranches: async (): Promise<Branch[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBranches.map(branch => ({
      ...branch,
      active: true,
      primary: branch.id === 1
    }));
  },

  getBranchById: async (id: number): Promise<Branch | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const branch = mockBranches.find(b => b.id === id);
    return branch ? { ...branch, active: true, primary: branch.id === 1 } : null;
  },

  createBranch: async (branchData: Omit<Branch, 'id'>): Promise<Branch> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newBranch: Branch = {
      id: Date.now(),
      ...branchData,
      active: true,
      primary: false
    };
    mockBranches.push(newBranch);
    return newBranch;
  },

  updateBranch: async (id: number, branchData: Partial<Branch>): Promise<Branch | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockBranches.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    mockBranches[index] = { ...mockBranches[index], ...branchData };
    return { ...mockBranches[index], active: true, primary: mockBranches[index].id === 1 };
  },

  deleteBranch: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockBranches.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    mockBranches.splice(index, 1);
    return true;
  }
};
