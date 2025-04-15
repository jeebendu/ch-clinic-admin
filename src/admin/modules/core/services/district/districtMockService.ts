import { Country, District, State } from "../../types/Address";

/**
 * Generate mock districts data for development
 */
export const getMockDistricts = (page: number, size: number, searchTerm?: string) => {
  const mockDistricts: District[] = [];

  // Generate 100 mock districts
  for (let i = 0; i < 100; i++) {
    const mockCountry: Country = {
      id: i % 10 + 1,
      name: `Country ${i % 10 + 1}`,
      code: `C${i % 10 + 1}`,
      iso: `ISO${i % 10 + 1}`,
      status: i % 2 === 0,
    };

    const mockState: State = {
      id: i % 20 + 1,
      name: `State ${i % 20 + 1}`,
      country: mockCountry,
    };

    const mockDistrict: District = {
      id: i + 1,
      name: `District ${i + 1}`,
      state: mockState,
    };

    mockDistricts.push(mockDistrict);
  }

  // Apply search filter
  let filteredDistricts = [...mockDistricts];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredDistricts = filteredDistricts.filter(
      (district) =>
        district.name.toLowerCase().includes(term) ||
        district.state.name.toLowerCase().includes(term) ||
        district.state.country.name.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedDistricts = filteredDistricts.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedDistricts,
      totalElements: filteredDistricts.length,
      totalPages: Math.ceil(filteredDistricts.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredDistricts.length,
    },
  });
};

/**
 * Mock function to get a single district by ID
 */
export const getMockDistrictById = async (id: number): Promise<District> => {
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
    id: id,
    name: `District ${id}`,
    state: mockState,
  };

  return Promise.resolve(mockDistrict);
};