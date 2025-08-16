import { Branch } from '../types/Branch';
import { Country } from '@/admin/modules/config/submodules/country/types/Country';
import { State } from '@/admin/modules/config/submodules/state/types/State';
import { District } from '@/admin/modules/config/submodules/district/types/District';

const mockCountry: Country = {
  id: 1,
  name: "India",
  code: "IN"
};

const mockState: State = {
  id: 1,
  name: "Karnataka",
  code: "KA",
  country: mockCountry
};

const mockDistrict: District = {
  id: 1,
  name: "Bangalore Urban",
  code: "BU",
  state: mockState
};

const mockBranches: Branch[] = [
  {
    id: 1,
    name: "Main Branch",
    location: "Downtown Medical Center",
    mapurl: "https://maps.google.com/main-branch",
    pincode: 560001,
    code: "MB001",
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Bangalore",
    active: true,
    primary: true,
  },
  {
    id: 2,
    name: "Satellite Branch",
    location: "Uptown Clinic Plaza",
    mapurl: "https://maps.google.com/satellite-branch",
    pincode: 560002,
    code: "SB002",
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Bangalore",
    active: false,
    primary: false,
  },
  {
    id: 3,
    name: "Tech Park Branch",
    location: "Tech Innovations Hub",
    mapurl: "https://maps.google.com/tech-park-branch",
    pincode: 560003,
    code: "TB003",
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: "Bangalore",
    active: true,
    primary: false,
  }
];

class BranchMockService {
  static async findAll(): Promise<Branch[]> {
    return Promise.resolve(mockBranches);
  }

  static async findById(id: number): Promise<Branch | null> {
    const branch = mockBranches.find(b => b.id === id);
    return Promise.resolve(branch || null);
  }

  static async saveOrUpdate(branchData: Partial<Branch>): Promise<Branch> {
    if (branchData.id) {
      // Update existing branch
      const index = mockBranches.findIndex(b => b.id === branchData.id);
      if (index !== -1) {
        mockBranches[index] = { 
          ...mockBranches[index], 
          ...branchData,
          active: branchData.active ?? mockBranches[index].active,
          primary: branchData.primary ?? mockBranches[index].primary,
        } as Branch;
        return Promise.resolve(mockBranches[index]);
      }
    }
    
    // Create new branch
    const newBranch: Branch = {
      id: Math.max(...mockBranches.map(b => b.id || 0)) + 1,
      name: branchData.name || "",
      location: branchData.location || "",
      mapurl: branchData.mapurl || "",
      pincode: branchData.pincode || 0,
      code: branchData.code || "",
      country: branchData.country || mockCountry,
      state: branchData.state || mockState,
      district: branchData.district || mockDistrict,
      city: branchData.city || "",
      active: branchData.active ?? true,
      primary: branchData.primary ?? false,
    };
    
    mockBranches.push(newBranch);
    return Promise.resolve(newBranch);
  }

  static async delete(id: number): Promise<void> {
    const index = mockBranches.findIndex(b => b.id === id);
    if (index !== -1) {
      mockBranches.splice(index, 1);
    }
    return Promise.resolve();
  }
}

export default BranchMockService;
