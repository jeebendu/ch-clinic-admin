import { Branch } from "../types/Branch";
import { Country, District, State } from "../../core/types/Address";

// Mock data
const mockCountry: Country = { id: 1, name: "India", code: "IN", status: true };
const mockState: State = { id: 1, name: "Maharashtra", country: mockCountry };
const mockDistrict: District = { id: 1, name: "Mumbai", state: mockState };

let mockBranches: Branch[] = [
  {
    id: 1,
    name: "Main Branch",
    location: "Downtown",
    mapurl: "https://maps.google.com",
    pincode: 400001,
    code: "MB001",
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Mumbai",
    active: true,
    primary: true,
    image: "",
    latitude: 19.0760,
    longitude: 72.8777
  },
  {
    id: 2,
    name: "Secondary Branch",
    location: "Andheri",
    mapurl: "https://maps.google.com",
    pincode: 400053,
    code: "MB002",
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Mumbai",
    active: true,
    primary: false,
    image: "",
    latitude: 19.1199,
    longitude: 72.8412
  },
  {
    id: 3,
    name: "Third Branch",
    location: "Bandra",
    mapurl: "https://maps.google.com",
    pincode: 400050,
    code: "MB003",
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Mumbai",
    active: true,
    primary: false,
    image: "",
    latitude: 19.0573,
    longitude: 72.8353
  }
];

const BranchMockService = {
  list: (): Promise<Branch[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBranches.map(branch => ({
          ...branch,
          active: true,
          primary: branch.id === 1
        })));
      }, 500);
    });
  },
  saveOrUpdate: (branch: Branch): Promise<Branch> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (branch.id) {
          mockBranches = mockBranches.map(b => b.id === branch.id ? { ...b, ...branch } : b);
        } else {
          const newId = mockBranches.length > 0 ? Math.max(...mockBranches.map(b => b.id)) + 1 : 1;
          mockBranches.push({ ...branch, id: newId });
        }
        resolve({ ...branch, active: true, primary: branch.id === 1 });
      }, 500);
    });
  },
  deleteById: (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockBranches = mockBranches.filter(b => b.id !== id);
        resolve();
      }, 500);
    });
  },
  getById: (id: number): Promise<Branch> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const branch = mockBranches.find(b => b.id === id);
        if (branch) {
          resolve({
            ...branch,
            active: true,
            primary: branch.id === 1
          });
        } else {
          reject(new Error('Branch not found'));
        }
      }, 500);
    });
  },
  
  updateStatus: (id: number, active: boolean): Promise<Branch> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const branchIndex = mockBranches.findIndex(b => b.id === id);
        if (branchIndex !== -1) {
          mockBranches[branchIndex] = { ...mockBranches[branchIndex], active };
          resolve(mockBranches[branchIndex]);
        } else {
          reject(new Error('Branch not found'));
        }
      }, 500);
    });
  }
};

export default BranchMockService;
