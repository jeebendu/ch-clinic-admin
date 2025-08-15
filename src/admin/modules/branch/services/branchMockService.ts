import { Branch } from "../types/Branch";
import { Country } from "../../core/types/Country";
import { State } from "../../core/types/State";
import { District } from "../../core/types/District";

const mockCountries: Country[] = [
  {
    id: 1,
    name: "USA",
    code: "US",
  },
];

const mockStates: State[] = [
  {
    id: 1,
    name: "New York",
    code: "NY",
    country: mockCountries[0],
  },
];

const mockDistricts: District[] = [
  {
    id: 1,
    name: "Manhattan",
    code: "MN",
    state: mockStates[0],
  },
];

const mockBranches: Branch[] = [
  {
    id: 1,
    name: "Main Branch",
    location: "Downtown Medical Center",
    mapurl: "https://maps.google.com",
    pincode: 12345,
    code: "MB001",
    active: true,
    primary: true,
    country: mockCountries[0],
    state: mockStates[0],
    district: mockDistricts[0],
    city: "New York",
    image: "/images/branch1.jpg",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 2,
    name: "North Branch",
    location: "Uptown Clinic",
    mapurl: "https://maps.google.com",
    pincode: 54321,
    code: "NB002",
    active: true,
    primary: false,
    country: mockCountries[0],
    state: mockStates[0],
    district: mockDistricts[0],
    city: "New York",
    image: "/images/branch2.jpg",
    latitude: 40.7831,
    longitude: -73.9712,
  },
  {
    id: 3,
    name: "East Branch",
    location: "Midtown East",
    mapurl: "https://maps.google.com",
    pincode: 67890,
    code: "EB003",
    active: true,
    primary: false,
    country: mockCountries[0],
    state: mockStates[0],
    district: mockDistricts[0],
    city: "New York",
    image: "/images/branch3.jpg",
    latitude: 40.7589,
    longitude: -73.9624,
  },
];

const getAllBranches = async (): Promise<Branch[]> => {
  return mockBranches;
};

const getBranchById = async (id: number): Promise<Branch | undefined> => {
  return mockBranches.find((branch) => branch.id === id);
};

const createBranch = async (branchData: Omit<Branch, 'id'>): Promise<Branch> => {
  const newBranch: Branch = {
    id: Date.now(),
    active: true,
    primary: false,
    ...branchData,
  };
  
  mockBranches.push(newBranch);
  return newBranch;
};

const updateBranch = async (id: number, branchData: Branch): Promise<Branch | undefined> => {
  const index = mockBranches.findIndex((branch) => branch.id === id);
  if (index !== -1) {
    mockBranches[index] = branchData;
    return mockBranches[index];
  }
  return undefined;
};

const deleteBranch = async (id: number): Promise<boolean> => {
  const index = mockBranches.findIndex((branch) => branch.id === id);
  if (index !== -1) {
    mockBranches.splice(index, 1);
    return true;
  }
  return false;
};

const branchMockService = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};

export default branchMockService;
