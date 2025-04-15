import { Branch } from "@/admin/mock/branch/branch";
import { Country } from "@/admin/types/country";
import { State } from "@/admin/types/state";
import { District } from "@/admin/types/district";

/**
 * Generate mock branches data for development
 */
export const getMockBranches = (page: number, size: number, searchTerm?: string) => {
  const mockBranches: Branch[] = [];

  // Generate 50 mock branches
  for (let i = 0; i < 50; i++) {
    const mockCountry: Country = {
      id: i % 3 + 1,
      name: `Country ${i % 3 + 1}`,
      code: `C${i % 3 + 1}`,
      iso: `ISO${i % 3 + 1}`,
      status: true,
    };

    const mockState: State = {
      id: i % 5 + 1,
      name: `State ${i % 5 + 1}`,
      country: mockCountry,
    };

    const mockDistrict: District = {
      id: i % 7 + 1,
      name: `District ${i % 7 + 1}`,
      state: mockState,
    };

    const mockBranch: Branch = {
      id: i + 1,
      name: `Branch ${i + 1}`,
      location: `Location ${i + 1}`,
      mapurl: `https://maps.example.com/branch${i + 1}`,
      pincode: 10000 + i,
      code: `BR${i + 1}`,
      country: mockCountry,
      state: mockState,
      district: mockDistrict,
      city: `City ${i + 1}`,
    };

    mockBranches.push(mockBranch);
  }

  // Apply search filter
  let filteredBranches = [...mockBranches];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredBranches = filteredBranches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(term) ||
        branch.location.toLowerCase().includes(term) ||
        branch.code.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedBranches,
      totalElements: filteredBranches.length,
      totalPages: Math.ceil(filteredBranches.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredBranches.length,
    },
  });
};

/**
 * Mock function to get a single branch by ID
 */
export const getMockBranchById = async (id: number): Promise<Branch> => {
  const mockCountry: Country = {
    id: 1,
    name: "Country 1",
    code: "C1",
    iso: "ISO1",
    status: true,
  };

  const mockState: State = {
    id: 1,
    name: "State 1",
    country: mockCountry,
  };

  const mockDistrict: District = {
    id: 1,
    name: "District 1",
    state: mockState,
  };

  const mockBranch: Branch = {
    id: id,
    name: `Branch ${id}`,
    location: `Location ${id}`,
    mapurl: `https://maps.example.com/branch${id}`,
    pincode: 10000 + id,
    code: `BR${id}`,
    country: mockCountry,
    state: mockState,
    district: mockDistrict,
    city: `City ${id}`,
  };

  return Promise.resolve(mockBranch);
};